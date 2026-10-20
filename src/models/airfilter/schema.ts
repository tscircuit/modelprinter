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
  drainLength: positive.default(8),
}
function validate(
  p: z.output<z.ZodObject<typeof shape>>,
  context: z.RefinementCtx,
) {
  if (p.bowlDiameter >= Math.min(p.bodyWidth, p.bodyDepth))
    context.addIssue({
      code: "custom",
      message: "Incompatible airfilter dimensions: 1",
    })
  if (p.portDiameter >= Math.min(p.bodyHeight, p.bodyDepth) / 2)
    context.addIssue({
      code: "custom",
      message: "Incompatible airfilter dimensions: 2",
    })
  if (p.drainLength >= p.bowlLength / 2)
    context.addIssue({
      code: "custom",
      message: "Incompatible airfilter dimensions: 3",
    })
}
export const airFilterModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const airFilterModelDefinitionSchema = z
  .object({ fn: z.literal("airfilter"), ...shape })
  .strict()
  .superRefine(validate)
export type AirFilterModelPropsInput = z.input<typeof airFilterModelPropsSchema>
export type AirFilterModelProps = z.output<typeof airFilterModelPropsSchema>
export type AirFilterModelDefinition = z.output<
  typeof airFilterModelDefinitionSchema
>
/** Pneumatic filter with a bowl guard, bottom drain and through ports in the head. Bowl and guard are a solid visual envelope; the filter media and transparent bowl interior are omitted. The drain is bored; there are no supplier-specific threads. All normalized lengths are millimeters. */
export function getAirFilterDimensions(input: AirFilterModelPropsInput = {}) {
  const p = airFilterModelPropsSchema.parse(input)
  return {
    ...p,
    size: [
      p.bodyWidth,
      p.bodyDepth,
      p.drainLength + p.bowlLength + p.bodyHeight,
    ] as [number, number, number],
  }
}
