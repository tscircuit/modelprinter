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
  length: positive.default(120),
  diameter: positive.default(24),
  boreDiameter: positive.default(12),
  endDiameter: positive.default(32),
  endLength: positive.default(12),
  floatDiameter: positive.default(8),
}
function validate(
  p: z.output<z.ZodObject<typeof shape>>,
  context: z.RefinementCtx,
) {
  if (p.boreDiameter >= p.diameter)
    context.addIssue({
      code: "custom",
      message: "Incompatible flowmeter dimensions: 1",
    })
  if (p.endDiameter <= p.diameter)
    context.addIssue({
      code: "custom",
      message: "Incompatible flowmeter dimensions: 2",
    })
  if (2 * p.endLength >= p.length)
    context.addIssue({
      code: "custom",
      message: "Incompatible flowmeter dimensions: 3",
    })
  if (p.floatDiameter >= p.boreDiameter)
    context.addIssue({
      code: "custom",
      message: "Incompatible flowmeter dimensions: 4",
    })
}
export const flowMeterModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const flowMeterModelDefinitionSchema = z
  .object({ fn: z.literal("flowmeter"), ...shape })
  .strict()
  .superRefine(validate)
export type FlowMeterModelPropsInput = z.input<typeof flowMeterModelPropsSchema>
export type FlowMeterModelProps = z.output<typeof flowMeterModelPropsSchema>
export type FlowMeterModelDefinition = z.output<
  typeof flowMeterModelDefinitionSchema
>
/** Vertical variable-area flowmeter with hollow end fittings, a rear tube wall, visible float and scale ticks. The front wall is intentionally cut away to show the nominal internal float through the inspection window; this is an explanatory envelope model rather than a closed pressure vessel. All normalized lengths are millimeters. */
export function getFlowMeterDimensions(input: FlowMeterModelPropsInput = {}) {
  const p = flowMeterModelPropsSchema.parse(input)
  return {
    ...p,
    size: [p.endDiameter, p.endDiameter, p.length] as [number, number, number],
  }
}
