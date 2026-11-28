import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { normalizeEyeNutProps } from "./normalize"
import { validateEyeNutProps } from "./validate"

const shape = {
  custom: z.literal(true).default(true),
  thread: z
    .string()
    .regex(/^m(?:\d+(?:\.\d+)?)$/i)
    .default("m8"),
  eyeInnerDiameter: positive.default(20),
  eyeWireDiameter: positive.default(6),
  baseOuterDiameter: positive.default(18),
  baseHeight: positive.default(10),
  threadDepth: positive.default(10),
  closedEye: z.literal(true).default(true),
  axialPlane: z.literal(true).default(true),
}

export const eyeNutModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateEyeNutProps)
  .transform(normalizeEyeNutProps)

export const eyeNutModelDefinitionSchema = z
  .object({ fn: z.literal("eyenut"), ...shape })
  .strict()
  .superRefine(validateEyeNutProps)
  .transform(normalizeEyeNutProps)

export type EyeNutModelPropsInput = z.input<typeof eyeNutModelPropsSchema>
export type EyeNutModelProps = z.output<typeof eyeNutModelPropsSchema>
export type EyeNutModelDefinition = z.output<typeof eyeNutModelDefinitionSchema>
