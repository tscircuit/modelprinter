import { z } from "zod"
import {
  positiveLength,
  nonnegativeLength,
  pneumaticAngle,
  pneumaticCount,
  pneumaticThread,
} from "../../pneumatic-model-params"

const shape = {
  length: positiveLength,
  width: positiveLength,
  height: positiveLength,
  jaws: pneumaticCount.default(2),
  jawTravel: positiveLength,
  opening: nonnegativeLength.default(0),
  jawAngle: pneumaticAngle.optional(),
  travel: pneumaticAngle.optional(),
  portThread: pneumaticThread.optional(),
  style: z.enum(["parallel", "angular"]).default("parallel"),
}

const propsSchema = z.object(shape).strict()
function validate(p: z.output<typeof propsSchema>, context: z.RefinementCtx) {
  if (!(p.jaws === 2 || p.jaws === 3)) {
    context.addIssue({ code: "custom", message: "Use two or three jaws" })
  }
  if (
    !(p.style === "angular"
      ? p.travel !== undefined &&
        p.travel > 0 &&
        p.travel <= 180 &&
        (p.jawAngle ?? 0) >= 0 &&
        (p.jawAngle ?? 0) <= p.travel
      : p.travel === undefined &&
        p.jawAngle === undefined &&
        p.opening <= 2 * p.jawTravel)
  ) {
    context.addIssue({
      code: "custom",
      message: "Set valid jaw travel and pose for the selected gripper style",
    })
  }
}

export const airGripperModelPropsSchema = propsSchema.superRefine(validate)
export const airGripperModelDefinitionSchema = propsSchema
  .extend({ fn: z.literal("airgripper") })
  .superRefine(validate)
export type AirGripperModelPropsInput = z.input<
  typeof airGripperModelPropsSchema
>
export type AirGripperModelProps = z.output<typeof airGripperModelPropsSchema>
export type AirGripperModelDefinition = z.output<
  typeof airGripperModelDefinitionSchema
>
