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
  bodyWidth: positive.default(40),
  bodyDepth: positive.default(40),
  bodyHeight: positive.default(30),
  bowlDiameter: positive.default(28),
  bowlLength: positive.default(50),
  portDiameter: positive.default(8),
  fillDiameter: positive.default(12),
  fillHeight: positive.default(8),
}
function validate(
  p: z.output<z.ZodObject<typeof shape>>,
  context: z.RefinementCtx,
) {
  if (p.bowlDiameter + 4 >= Math.min(p.bodyWidth, p.bodyDepth))
    context.addIssue({
      code: "custom",
      message: "Incompatible airlubricator dimensions: 1",
    })
  if (p.portDiameter >= Math.min(p.bodyHeight, p.bodyDepth) / 2)
    context.addIssue({
      code: "custom",
      message: "Incompatible airlubricator dimensions: 2",
    })
  if (p.fillDiameter >= Math.min(p.bodyWidth, p.bodyDepth) / 2)
    context.addIssue({
      code: "custom",
      message: "Incompatible airlubricator dimensions: 3",
    })
}
export const airLubricatorModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const airLubricatorModelDefinitionSchema = z
  .object({ fn: z.literal("airlubricator"), ...shape })
  .strict()
  .superRefine(validate)
export type AirLubricatorModelPropsInput = z.input<
  typeof airLubricatorModelPropsSchema
>
export type AirLubricatorModelProps = z.output<
  typeof airLubricatorModelPropsSchema
>
export type AirLubricatorModelDefinition = z.output<
  typeof airLubricatorModelDefinitionSchema
>
/** Air-line lubricator with cylindrical reservoir, sight recess, retaining collar and top fill cap. The solid reservoir is an external envelope and does not represent oil volume or the metering internals. All normalized lengths are millimeters. */
export function getAirLubricatorDimensions(
  input: AirLubricatorModelPropsInput = {},
) {
  const p = airLubricatorModelPropsSchema.parse(input)
  return {
    ...p,
    size: [
      p.bodyWidth,
      p.bodyDepth,
      p.bowlLength + p.bodyHeight + p.fillHeight,
    ] as [number, number, number],
  }
}
