import { z } from "zod"
import { positiveLength, pneumaticThread } from "../../pneumatic-model-params"

const shape = {
  outerDiameter: positiveLength,
  caseDepth: positiveLength,
  stemLength: positiveLength,
  range: z.coerce.number().finite().positive(),
  reading: z.coerce.number().finite().nonnegative().default(0),
  portThread: pneumaticThread,
  innerPortThread: pneumaticThread.optional(),
  mount: z.enum(["backmount", "bottommount"]).default("backmount"),
  unit: z.enum(["psi", "bar"]).default("psi"),
}

const propsSchema = z.object(shape).strict()
function validate(p: z.output<typeof propsSchema>, context: z.RefinementCtx) {
  if (!(p.reading <= p.range)) {
    context.addIssue({
      code: "custom",
      message: "Gauge reading must be within the scale",
    })
  }
}

export const pressureGaugeModelPropsSchema = propsSchema.superRefine(validate)
export const pressureGaugeModelDefinitionSchema = propsSchema
  .extend({ fn: z.literal("pressuregauge") })
  .superRefine(validate)
export type PressureGaugeModelPropsInput = z.input<
  typeof pressureGaugeModelPropsSchema
>
export type PressureGaugeModelProps = z.output<
  typeof pressureGaugeModelPropsSchema
>
export type PressureGaugeModelDefinition = z.output<
  typeof pressureGaugeModelDefinitionSchema
>
