import { z } from "zod"
import {
  positiveLength,
  pneumaticCount,
  pneumaticThread,
} from "../../pneumatic-model-params"

const shape = {
  length: positiveLength,
  width: positiveLength,
  height: positiveLength,
  stations: pneumaticCount,
  stationPitch: positiveLength,
  portThread: pneumaticThread.optional(),
}

const propsSchema = z.object(shape).strict()
function validate(p: z.output<typeof propsSchema>, context: z.RefinementCtx) {
  if (!((p.stations - 1) * p.stationPitch < p.length)) {
    context.addIssue({ code: "custom", message: "Stations must fit the base" })
  }
}

export const airValveManifoldModelPropsSchema =
  propsSchema.superRefine(validate)
export const airValveManifoldModelDefinitionSchema = propsSchema
  .extend({ fn: z.literal("airvalvemanifold") })
  .superRefine(validate)
export type AirValveManifoldModelPropsInput = z.input<
  typeof airValveManifoldModelPropsSchema
>
export type AirValveManifoldModelProps = z.output<
  typeof airValveManifoldModelPropsSchema
>
export type AirValveManifoldModelDefinition = z.output<
  typeof airValveManifoldModelDefinitionSchema
>
