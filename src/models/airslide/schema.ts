import { z } from "zod"
import {
  positiveLength,
  nonnegativeLength,
  pneumaticThread,
} from "../../pneumatic-model-params"

const shape = {
  length: positiveLength,
  width: positiveLength,
  height: positiveLength,
  stroke: positiveLength,
  carriageLength: positiveLength,
  extension: nonnegativeLength.default(0),
  portThread: pneumaticThread.optional(),
  style: z.enum(["rodless", "guided"]).default("rodless"),
}

const propsSchema = z.object(shape).strict()
function validate(p: z.output<typeof propsSchema>, context: z.RefinementCtx) {
  if (!(p.extension <= p.stroke)) {
    context.addIssue({
      code: "custom",
      message: "Extension must be within the stroke",
    })
  }
  if (!(p.style !== "rodless" || p.stroke + p.carriageLength <= p.length)) {
    context.addIssue({
      code: "custom",
      message:
        "The rodless carriage must stay within the body through its stroke",
    })
  }
}

export const airSlideModelPropsSchema = propsSchema.superRefine(validate)
export const airSlideModelDefinitionSchema = propsSchema
  .extend({ fn: z.literal("airslide") })
  .superRefine(validate)
export type AirSlideModelPropsInput = z.input<typeof airSlideModelPropsSchema>
export type AirSlideModelProps = z.output<typeof airSlideModelPropsSchema>
export type AirSlideModelDefinition = z.output<
  typeof airSlideModelDefinitionSchema
>
