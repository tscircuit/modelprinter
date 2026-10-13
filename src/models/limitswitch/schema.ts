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
  width: positive.default(30),
  depth: positive.default(20),
  height: positive.default(55),
  actuatorLength: positive.default(30),
  rollerDiameter: positive.default(12),
  leverThickness: positive.default(3),
  holeDiameter: positive.default(4),
}
function validate(
  p: z.output<z.ZodObject<typeof shape>>,
  context: z.RefinementCtx,
) {
  if (p.rollerDiameter >= p.actuatorLength)
    context.addIssue({
      code: "custom",
      message: "Incompatible limitswitch dimensions: 1",
    })
  if (p.leverThickness >= p.depth / 2)
    context.addIssue({
      code: "custom",
      message: "Incompatible limitswitch dimensions: 2",
    })
  if (p.holeDiameter >= Math.min(p.width / 4, p.height * 0.3))
    context.addIssue({
      code: "custom",
      message: "Incompatible limitswitch dimensions: 3",
    })
}
export const limitSwitchModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const limitSwitchModelDefinitionSchema = z
  .object({ fn: z.literal("limitswitch"), ...shape })
  .strict()
  .superRefine(validate)
export type LimitSwitchModelPropsInput = z.input<
  typeof limitSwitchModelPropsSchema
>
export type LimitSwitchModelProps = z.output<typeof limitSwitchModelPropsSchema>
export type LimitSwitchModelDefinition = z.output<
  typeof limitSwitchModelDefinitionSchema
>
/** Industrial roller-lever limit switch with a transverse pivot, straight lever, end roller and two mounting bores. The lever is fixed in its nominal horizontal position; electrical contacts and motion are omitted. All normalized lengths are millimeters. */
export function getLimitSwitchDimensions(
  input: LimitSwitchModelPropsInput = {},
) {
  const p = limitSwitchModelPropsSchema.parse(input)
  return {
    ...p,
    size: [
      p.width / 2 + p.actuatorLength + p.rollerDiameter / 2,
      p.depth + 2,
      p.height + 8 + p.rollerDiameter / 2,
    ] as [number, number, number],
  }
}
