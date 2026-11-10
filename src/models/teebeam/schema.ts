import { z } from "zod"
import {
  nonnegativeGearLengthSchema as nonnegativeLength,
  positiveGearLengthSchema as positiveLength,
} from "../../gear-parameter-schemas"

const shape = {
  height: positiveLength,
  width: positiveLength,
  webThickness: positiveLength,
  flangeThickness: positiveLength,
  rootRadius: nonnegativeLength.default(0),
  length: positiveLength,
}
type ResolvedProps = z.output<z.ZodObject<typeof shape>>

function profile(props: ResolvedProps) {
  const halfWidth = props.width / 2
  const halfWeb = props.webThickness / 2
  return {
    halfWidth,
    halfWeb,
    flangeTangentX: halfWeb + props.rootRadius,
    webTangentY: props.flangeThickness + props.rootRadius,
  }
}

function validate(props: ResolvedProps, context: z.RefinementCtx) {
  const issue = (path: keyof ResolvedProps, message: string) =>
    context.addIssue({ code: "custom", path: [path], message })
  const { halfWidth, halfWeb, flangeTangentX, webTangentY } = profile(props)
  if (halfWidth <= 0 || 2 * halfWidth !== props.width)
    issue(
      "width",
      "The flange width must have a positive, representable half-width",
    )
  if (
    halfWeb <= 0 ||
    2 * halfWeb !== props.webThickness ||
    halfWeb >= halfWidth
  )
    issue("webThickness", "The web must leave a flat flange on each side")
  if (props.flangeThickness >= props.height)
    issue("flangeThickness", "The flange must leave an exposed web above it")
  if (
    props.rootRadius > 0 &&
    !(
      flangeTangentX > halfWeb &&
      flangeTangentX < halfWidth &&
      webTangentY > props.flangeThickness &&
      webTangentY < props.height
    )
  )
    issue(
      "rootRadius",
      "The two root radii must be distinct and leave flat flange and web faces",
    )
}

export const teeBeamModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const teeBeamModelDefinitionSchema = z
  .object({ fn: z.literal("teebeam"), ...shape })
  .strict()
  .superRefine(validate)

export type TeeBeamModelPropsInput = z.input<typeof teeBeamModelPropsSchema>
export type TeeBeamModelProps = z.output<typeof teeBeamModelPropsSchema>
export type TeeBeamModelDefinition = z.output<
  typeof teeBeamModelDefinitionSchema
>

/** The flange spans Y=0..flangeThickness and the length runs along +Z. */
export function getTeeBeamDimensions(input: TeeBeamModelPropsInput) {
  const props = teeBeamModelPropsSchema.parse(input)
  const { halfWidth, halfWeb, flangeTangentX, webTangentY } = profile(props)
  return {
    ...props,
    flangeOverhang: halfWidth - halfWeb,
    webHeight: props.height - props.flangeThickness,
    flatFlangeLength: halfWidth - flangeTangentX,
    flatWebHeight: props.height - webTangentY,
    size: [props.width, props.height, props.length] as [number, number, number],
    bounds: {
      min: [-halfWidth, 0, 0] as [number, number, number],
      max: [halfWidth, props.height, props.length] as [number, number, number],
    },
    bottomZ: 0,
    topZ: props.length,
  }
}
