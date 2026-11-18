import { z } from "zod"
import { positiveLength, pneumaticThread } from "../../pneumatic-model-params"

const shape = {
  length: positiveLength,
  width: positiveLength,
  height: positiveLength,
  knobDiameter: positiveLength.optional(),
  knobLength: positiveLength.optional(),
  portThread: pneumaticThread,
  inletThread: pneumaticThread.optional(),
  outletThread: pneumaticThread.optional(),
  layout: z.enum(["inline", "axialradial"]).default("inline"),
  filterBowl: z.boolean().default(false),
  gauge: z.boolean().default(false),
  relieving: z.boolean().default(false),
}

const propsSchema = z.object(shape).strict()
function validate(p: z.output<typeof propsSchema>, context: z.RefinementCtx) {
  if (!(p.layout !== "axialradial" || (!p.filterBowl && !p.gauge))) {
    context.addIssue({
      code: "custom",
      message: "Axial/radial regulators use a standalone body",
    })
  }
  if (
    !(
      p.knobLength === undefined ||
      p.knobLength < (p.layout === "axialradial" ? p.length : p.height)
    )
  ) {
    context.addIssue({
      code: "custom",
      message: "Knob length must fit the regulator",
    })
  }
}

export const airRegulatorModelPropsSchema = propsSchema.superRefine(validate)
export const airRegulatorModelDefinitionSchema = propsSchema
  .extend({ fn: z.literal("airregulator") })
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
