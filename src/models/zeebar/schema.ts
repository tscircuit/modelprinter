import { z } from "zod"
import {
  positiveGearLengthSchema as positive,
  nonnegativeGearLengthSchema as nonnegative,
} from "../../gear-parameter-schemas"

const shape = {
  height: positive,
  upperWidth: positive,
  lowerWidth: positive,
  thickness: positive,
  bendRadius: nonnegative,
  length: positive,
}
type ResolvedProps = z.output<z.ZodObject<typeof shape>>
function validate(p: ResolvedProps, context: z.RefinementCtx) {
  const issue = (message: string, path: keyof ResolvedProps) =>
    context.addIssue({ code: "custom", message, path: [path] })
  const largestDimension = Math.max(
    ...Object.values(p).filter(
      (value): value is number => typeof value === "number",
    ),
  )
  if (!Number.isFinite((4 * largestDimension) ** 3)) {
    issue(
      "Dimensions must permit finite derived coordinates and volume",
      "height",
    )
    return
  }
  if (p.bendRadius + p.thickness >= Math.min(p.upperWidth, p.lowerWidth))
    issue(
      "Both flanges must retain straight portions beyond their bends",
      "bendRadius",
    )
  if (2 * (p.bendRadius + p.thickness) >= p.height)
    issue("Height must leave a straight web between both bends", "height")
  if (!Number.isFinite(p.upperWidth + p.lowerWidth - p.thickness))
    issue("The combined section width must be finite", "upperWidth")
}
/** Constant-thickness Z-section with lower flange toward -X, upper flange toward +X, and length along +Z from zero. The XY envelope is centered. upperWidth/lowerWidth include the web thickness; total width is upperWidth+lowerWidth-thickness. height is outside-to-outside. bendRadius is the inside radius and outside bends use bendRadius+thickness. All lengths normalize to millimeters. All dimensions are required. */
export const zeeBarModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const zeeBarModelDefinitionSchema = z
  .object({ fn: z.literal("zeebar"), ...shape })
  .strict()
  .superRefine(validate)
export type ZeeBarModelPropsInput = z.input<typeof zeeBarModelPropsSchema>
export type ZeeBarModelProps = z.output<typeof zeeBarModelPropsSchema>
export type ZeeBarModelDefinition = z.output<typeof zeeBarModelDefinitionSchema>
export function getZeeBarDimensions(input: ZeeBarModelPropsInput) {
  const p = zeeBarModelPropsSchema.parse(input)
  return {
    ...p,
    size: [p.upperWidth + p.lowerWidth - p.thickness, p.height, p.length] as [
      number,
      number,
      number,
    ],
    bottomZ: 0,
    topZ: p.length,
  }
}
