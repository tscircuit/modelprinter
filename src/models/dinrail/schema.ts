import { z } from "zod"
import { industrialLengthSchema } from "../../industrial-parameter-utils"
const positive = industrialLengthSchema.refine(
  (value) => value > 0,
  "Length must be positive",
)
const nonnegative = industrialLengthSchema.refine(
  (value) => value >= 0,
  "Length must be nonnegative",
)
const shape = {
  width: positive.default(35),
  height: positive.default(7.5),
  thickness: positive.default(1),
  length: positive.default(100),
  holeDiameter: positive.default(5),
  slotLength: positive.default(10),
  slotPitch: positive.default(25),
}
function validate(
  p: z.output<z.ZodObject<typeof shape>>,
  context: z.RefinementCtx,
) {
  if (2 * p.thickness >= p.height)
    context.addIssue({
      code: "custom",
      message: "Incompatible dinrail dimensions: 1",
    })
  if (4 * p.thickness >= p.width)
    context.addIssue({
      code: "custom",
      message: "Incompatible dinrail dimensions: 2",
    })
  if (p.holeDiameter >= p.width * 0.45)
    context.addIssue({
      code: "custom",
      message: "Incompatible dinrail dimensions: 3",
    })
  if (p.slotLength < p.holeDiameter)
    context.addIssue({
      code: "custom",
      message: "Incompatible dinrail dimensions: 4",
    })
  if (p.slotPitch <= p.slotLength)
    context.addIssue({
      code: "custom",
      message: "Incompatible dinrail dimensions: 5",
    })
  if (p.length < p.slotPitch)
    context.addIssue({
      code: "custom",
      message: "Incompatible dinrail dimensions: 6",
    })
  if (p.length / p.slotPitch > 512)
    context.addIssue({
      code: "custom",
      message: "Too many repeated rail or duct features; maximum 512",
    })
}
export const dinRailModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const dinRailModelDefinitionSchema = z
  .object({ fn: z.literal("dinrail"), ...shape })
  .strict()
  .superRefine(validate)
export type DinRailModelPropsInput = z.input<typeof dinRailModelPropsSchema>
export type DinRailModelProps = z.output<typeof dinRailModelPropsSchema>
export type DinRailModelDefinition = z.output<
  typeof dinRailModelDefinitionSchema
>
/** Generic top-hat DIN rail with a central floor, upright webs, outturned flanges and repeated oblong mounting holes. Rail length runs along X and the section width is Y. Dimensions are nominal; this model does not assert compliance with a rail standard. All normalized lengths are millimeters. */
export function getDinRailDimensions(input: DinRailModelPropsInput = {}) {
  const p = dinRailModelPropsSchema.parse(input)
  return {
    ...p,
    size: [p.length, p.width, p.height] as [number, number, number],
  }
}
