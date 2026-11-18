import { z } from "zod"
import { positiveLength, pneumaticThread } from "../../pneumatic-model-params"

const shape = {
  tubeOuterDiameter: positiveLength,
  length: positiveLength.optional(),
  bodyDiameter: positiveLength.optional(),
  threadLength: positiveLength.optional(),
  branchLength: positiveLength.optional(),
  hexAcrossFlats: positiveLength.optional(),
  thread: pneumaticThread.optional(),
  shape: z.enum(["straight", "elbow", "tee"]).default("straight"),
  threadGender: z.enum(["male", "female"]).optional(),
}

const propsSchema = z.object(shape).strict()
function validate(p: z.output<typeof propsSchema>, context: z.RefinementCtx) {
  if (!(Boolean(p.thread) === Boolean(p.threadGender))) {
    context.addIssue({
      code: "custom",
      message: "Specify a thread designation and gender together",
    })
  }
  if (
    !(
      p.threadLength === undefined ||
      (p.thread !== undefined &&
        (p.length === undefined ||
          p.shape !== "straight" ||
          p.threadLength < p.length))
    )
  ) {
    context.addIssue({
      code: "custom",
      message:
        "Thread length requires a thread and must fit a straight fitting",
    })
  }
  if (!(p.branchLength === undefined || p.shape !== "straight")) {
    context.addIssue({
      code: "custom",
      message: "Branch length requires an elbow or tee",
    })
  }
  if (!(p.bodyDiameter === undefined || p.bodyDiameter > p.tubeOuterDiameter)) {
    context.addIssue({
      code: "custom",
      message: "Body diameter must exceed the tube OD",
    })
  }
  if (
    !(p.hexAcrossFlats === undefined || p.hexAcrossFlats > p.tubeOuterDiameter)
  ) {
    context.addIssue({
      code: "custom",
      message: "Hex across flats must exceed the tube OD",
    })
  }
}

export const pushFittingModelPropsSchema = propsSchema.superRefine(validate)
export const pushFittingModelDefinitionSchema = propsSchema
  .extend({ fn: z.literal("pushfitting") })
  .superRefine(validate)
export type PushFittingModelPropsInput = z.input<
  typeof pushFittingModelPropsSchema
>
export type PushFittingModelProps = z.output<typeof pushFittingModelPropsSchema>
export type PushFittingModelDefinition = z.output<
  typeof pushFittingModelDefinitionSchema
>
