import { z } from "zod"
import {
  positiveGearLengthSchema as positive,
  nonnegativeGearLengthSchema as nonnegative,
} from "../../gear-parameter-schemas"

const shape = {
  crownWidth: positive,
  height: positive,
  lipWidth: positive,
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
      "crownWidth",
    )
    return
  }
  if (2 * (p.bendRadius + p.thickness) >= p.crownWidth)
    issue(
      "The crown must retain a straight portion between both bends",
      "crownWidth",
    )
  if (2 * (p.bendRadius + p.thickness) >= p.height)
    issue(
      "Height must leave straight webs between the crown and lip bends",
      "height",
    )
  if (p.lipWidth <= p.bendRadius)
    issue("Lips must extend beyond their bend tangents", "lipWidth")
  if (!Number.isFinite(p.crownWidth + 2 * p.lipWidth))
    issue("The combined section width must be finite", "crownWidth")
}
/** Constant-thickness hat section centered on XY with outward lips at minimum Y, raised crown at maximum Y, and length along +Z from zero. crownWidth is the outside width across both upright webs, lipWidth extends outward from each outside web, and total width is crownWidth+2*lipWidth. bendRadius is inside radius; all outside bends have radius bendRadius+thickness. All lengths normalize to millimeters. All dimensions are required. */
export const hatSectionModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const hatSectionModelDefinitionSchema = z
  .object({ fn: z.literal("hatsection"), ...shape })
  .strict()
  .superRefine(validate)
export type HatSectionModelPropsInput = z.input<
  typeof hatSectionModelPropsSchema
>
export type HatSectionModelProps = z.output<typeof hatSectionModelPropsSchema>
export type HatSectionModelDefinition = z.output<
  typeof hatSectionModelDefinitionSchema
>
export function getHatSectionDimensions(input: HatSectionModelPropsInput) {
  const p = hatSectionModelPropsSchema.parse(input)
  return {
    ...p,
    size: [p.crownWidth + 2 * p.lipWidth, p.height, p.length] as [
      number,
      number,
      number,
    ],
    bottomZ: 0,
    topZ: p.length,
  }
}
