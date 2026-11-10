import { z } from "zod"
import { positiveGearLengthSchema as positiveLength } from "../../gear-parameter-schemas"

const shape = {
  diameter: positiveLength,
  length: positiveLength,
  hexEnds: z.literal(true).default(true),
  endAcrossFlats: positiveLength,
  endLength: positiveLength,
  transitionLength: positiveLength,
}
type ResolvedProps = z.output<z.ZodObject<typeof shape>>

function axialStations(props: ResolvedProps) {
  const middleStartZ = props.endLength + props.transitionLength
  return {
    firstKeyEndZ: props.endLength,
    middleStartZ,
    middleEndZ: props.length - middleStartZ,
    lastKeyStartZ: props.length - props.endLength,
  }
}

function endAcrossCorners(endAcrossFlats: number) {
  return 2 * (endAcrossFlats / Math.sqrt(3))
}

function validate(props: ResolvedProps, context: z.RefinementCtx) {
  const issue = (path: keyof ResolvedProps, message: string) =>
    context.addIssue({ code: "custom", path: [path], message })
  for (const key of ["diameter", "endAcrossFlats"] as const) {
    const half = props[key] / 2
    if (half <= 0 || 2 * half !== props[key])
      issue(key, "Dimension must have a positive, representable half-width")
  }
  if (!Number.isFinite(endAcrossCorners(props.endAcrossFlats)))
    issue(
      "endAcrossFlats",
      "The keyed end must have a finite corner-to-corner size",
    )
  const { firstKeyEndZ, middleStartZ, middleEndZ, lastKeyStartZ } =
    axialStations(props)
  if (
    !(
      firstKeyEndZ < middleStartZ &&
      middleStartZ < middleEndZ &&
      middleEndZ < lastKeyStartZ &&
      lastKeyStartZ < props.length
    )
  )
    issue(
      "length",
      "The ends and transitions must leave distinct sections and a positive middle span",
    )
}

export const torsionBarModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const torsionBarModelDefinitionSchema = z
  .object({ fn: z.literal("torsionbar"), ...shape })
  .strict()
  .superRefine(validate)

export type TorsionBarModelPropsInput = z.input<
  typeof torsionBarModelPropsSchema
>
export type TorsionBarModelProps = z.output<typeof torsionBarModelPropsSchema>
export type TorsionBarModelDefinition = z.output<
  typeof torsionBarModelDefinitionSchema
>

/** Coaxial round stock with two equal, aligned hex ends. The ends have a
 * pair of flats normal to X. Z=0..length, in millimeters.
 */
export function getTorsionBarDimensions(input: TorsionBarModelPropsInput) {
  const props = torsionBarModelPropsSchema.parse(input)
  const stations = axialStations(props)
  const cornerSpan = endAcrossCorners(props.endAcrossFlats)
  const width = Math.max(props.diameter, props.endAcrossFlats)
  const height = Math.max(props.diameter, cornerSpan)
  return {
    ...props,
    ...stations,
    endAcrossCorners: cornerSpan,
    middleLength: stations.middleEndZ - stations.middleStartZ,
    size: [width, height, props.length] as [number, number, number],
    bounds: {
      min: [-width / 2, -height / 2, 0] as [number, number, number],
      max: [width / 2, height / 2, props.length] as [number, number, number],
    },
    bottomZ: 0,
    topZ: props.length,
  }
}
