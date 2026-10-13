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
  bodyDepth: positive.default(36),
  bodyHeight: positive.default(30),
  knobDiameter: positive.default(28),
  knobHeight: positive.default(20),
  portDiameter: positive.default(8),
  gaugeDiameter: positive.default(20),
}
function validate(
  p: z.output<z.ZodObject<typeof shape>>,
  context: z.RefinementCtx,
) {
  if (p.knobDiameter * 1.01 >= Math.min(p.bodyWidth, p.bodyDepth))
    context.addIssue({
      code: "custom",
      message: "Incompatible airregulator dimensions: 1",
    })
  if (p.portDiameter >= Math.min(p.bodyHeight, p.bodyDepth) / 2)
    context.addIssue({
      code: "custom",
      message: "Incompatible airregulator dimensions: 2",
    })
  if (p.gaugeDiameter >= p.bodyHeight)
    context.addIssue({
      code: "custom",
      message: "Incompatible airregulator dimensions: 3",
    })
}
export const airRegulatorModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const airRegulatorModelDefinitionSchema = z
  .object({ fn: z.literal("airregulator"), ...shape })
  .strict()
  .superRefine(validate)
export type AirRegulatorModelPropsInput = z.input<
  typeof airRegulatorModelPropsSchema
>
export type AirRegulatorModelProps = z.output<
  typeof airRegulatorModelPropsSchema
>
export type AirRegulatorModelDefinition = z.output<
  typeof airRegulatorModelDefinitionSchema
>
/** Air pressure regulator with a fluted adjustment knob, front gauge bezel and lateral through ports. The head and gauge are nominal visual envelopes; concealed diaphragm and calibrated gauge markings are omitted. All normalized lengths are millimeters. */
export function getAirRegulatorDimensions(
  input: AirRegulatorModelPropsInput = {},
) {
  const p = airRegulatorModelPropsSchema.parse(input)
  return {
    ...p,
    size: [p.bodyWidth, p.bodyDepth + 5, p.bodyHeight + p.knobHeight] as [
      number,
      number,
      number,
    ],
  }
}
