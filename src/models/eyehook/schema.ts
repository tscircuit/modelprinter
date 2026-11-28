import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateEyeHookProps } from "./validate"

const shape = {
  height: positive.default(100),
  width: positive.default(65),
  bodyDiameter: positive.default(16),
  throatOpening: positive.default(25),
  bendRadius: positive.default(20),
  eyeInnerDiameter: positive.default(20),
  eyeOuterDiameter: positive.default(40),
  noLatch: z.literal(true).default(true),
}

export const eyeHookModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateEyeHookProps)

export const eyeHookModelDefinitionSchema = z
  .object({ fn: z.literal("eyehook"), ...shape })
  .strict()
  .superRefine(validateEyeHookProps)

export type EyeHookModelPropsInput = z.input<typeof eyeHookModelPropsSchema>
export type EyeHookModelProps = z.output<typeof eyeHookModelPropsSchema>
export type EyeHookModelDefinition = z.output<
  typeof eyeHookModelDefinitionSchema
>
