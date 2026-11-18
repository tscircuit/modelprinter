import { z } from "zod"
import { positiveLength } from "../../pneumatic-model-params"

const shape = {
  length: positiveLength,
  width: positiveLength,
  height: positiveLength,
  hoseInnerDiameter: positiveLength,
  headLength: positiveLength,
  motorDiameter: positiveLength,
  barbPitch: positiveLength,
  barbLength: positiveLength,
  mountPitchX: positiveLength.optional(),
  mountPitchY: positiveLength.optional(),
  motor: z.enum(["brusheddc", "brushlessdc"]).default("brusheddc"),
}

const propsSchema = z.object(shape).strict()
function validate(p: z.output<typeof propsSchema>, context: z.RefinementCtx) {
  if (!(p.headLength + p.barbLength < p.length)) {
    context.addIssue({
      code: "custom",
      message: "Head and barbs must fit along the pump length",
    })
  }
  if (!(p.motorDiameter <= Math.min(p.width, p.height))) {
    context.addIssue({
      code: "custom",
      message: "Motor diameter must fit the pump envelope",
    })
  }
  if (
    !(
      p.barbPitch > p.hoseInnerDiameter &&
      p.barbPitch + p.hoseInnerDiameter <= p.width
    )
  ) {
    context.addIssue({
      code: "custom",
      message: "Barbs must be spaced apart and fit across the head",
    })
  }
  if (!((p.mountPitchX === undefined) === (p.mountPitchY === undefined))) {
    context.addIssue({
      code: "custom",
      message: "Specify both mounting pitches together",
    })
  }
  if (
    !(
      (p.mountPitchX === undefined || p.mountPitchX < p.length) &&
      (p.mountPitchY === undefined || p.mountPitchY < p.width)
    )
  ) {
    context.addIssue({
      code: "custom",
      message: "Mounting pitches must fit the footprint",
    })
  }
}

export const diaphragmPumpModelPropsSchema = propsSchema.superRefine(validate)
export const diaphragmPumpModelDefinitionSchema = propsSchema
  .extend({ fn: z.literal("diaphragmpump") })
  .superRefine(validate)
export type DiaphragmPumpModelPropsInput = z.input<
  typeof diaphragmPumpModelPropsSchema
>
export type DiaphragmPumpModelProps = z.output<
  typeof diaphragmPumpModelPropsSchema
>
export type DiaphragmPumpModelDefinition = z.output<
  typeof diaphragmPumpModelDefinitionSchema
>
