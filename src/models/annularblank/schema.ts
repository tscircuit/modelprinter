import { z } from "zod"
import { modelLengthSchema } from "../../model-length-schema"

const length = z
  .union([
    z.number(),
    z
      .string()
      .regex(
        /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:mm|cm|m|in|inch|mil|ft|feet)?$/i,
        "Expected a complete numeric length with an optional unit",
      )
      .transform((value) => value.toLowerCase()),
  ])
  .pipe(modelLengthSchema)
const positiveLength = length.refine(
  (value) => value > 0,
  "Length must be positive",
)
const shape = {
  innerDiameter: positiveLength,
  outerDiameter: positiveLength,
  thickness: positiveLength,
  /** Equal quarter-circle fillets at all four bore/outside circular rims. */
  rimRadius: length.refine((value) => value >= 0).default(0),
}

type ResolvedProps = z.output<z.ZodObject<typeof shape>>

function validate(props: ResolvedProps, context: z.RefinementCtx) {
  const issue = (message: string, property: keyof ResolvedProps) =>
    context.addIssue({ code: "custom", path: [property], message })
  if (props.outerDiameter <= props.innerDiameter)
    issue("Outside diameter must exceed the bore diameter", "outerDiameter")

  const radialWidth = (props.outerDiameter - props.innerDiameter) / 2
  if (props.innerDiameter / 2 === 0 || radialWidth <= 0)
    issue(
      "The bore radius and radial width must remain positive",
      "innerDiameter",
    )
  if (2 * props.rimRadius >= radialWidth)
    issue(
      "The rim fillets must leave a positive-width annular face",
      "rimRadius",
    )
  if (2 * props.rimRadius >= props.thickness)
    issue(
      "The rim fillets must leave positive straight wall height",
      "rimRadius",
    )
  if (
    props.innerDiameter + 2 * props.rimRadius >=
    props.outerDiameter - 2 * props.rimRadius
  )
    issue("The flat face diameters must remain distinct", "rimRadius")
}

/** Ring centered on XY, with axis Z, bottom Z=0 and top Z=thickness. */
export const annularBlankModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const annularBlankModelDefinitionSchema = z
  .object({ fn: z.literal("annularblank"), ...shape })
  .strict()
  .superRefine(validate)

export type AnnularBlankModelPropsInput = z.input<
  typeof annularBlankModelPropsSchema
>
export type AnnularBlankModelProps = z.output<
  typeof annularBlankModelPropsSchema
>
export type AnnularBlankModelDefinition = z.output<
  typeof annularBlankModelDefinitionSchema
>

/** Normalized millimeter dimensions, fillet tangencies and envelope datums. */
export function getAnnularBlankDimensions(input: AnnularBlankModelPropsInput) {
  const props = annularBlankModelPropsSchema.parse(input)
  const radialWidth = (props.outerDiameter - props.innerDiameter) / 2
  return {
    ...props,
    innerRadius: props.innerDiameter / 2,
    outerRadius: props.outerDiameter / 2,
    radialWidth,
    flatFaceInnerDiameter: props.innerDiameter + 2 * props.rimRadius,
    flatFaceOuterDiameter: props.outerDiameter - 2 * props.rimRadius,
    flatFaceWidth: radialWidth - 2 * props.rimRadius,
    straightWallHeight: props.thickness - 2 * props.rimRadius,
    size: [props.outerDiameter, props.outerDiameter, props.thickness] as [
      number,
      number,
      number,
    ],
    bottomZ: 0,
    topZ: props.thickness,
  }
}
