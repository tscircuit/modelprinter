import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { normalizeAntiBacklashNutProps } from "./normalize"
import { validateAntiBacklashNutProps } from "./validate"

const shape = {
  boreDiameter: positive.default(8),
  outerDiameter: positive.default(20),
  length: positive.default(30),
  trapezoidalThread: z
    .string()
    .regex(/^tr(?:\d+(?:\.\d+)?)$/i)
    .default("tr8"),
  threadPitch: positive.default(2),
  lead: positive.default(2),
  starts: z.number().int().min(1).default(1),
  face2Hole: z.literal(true).default(true),
  flangeOuterDiameter: positive.default(32),
  pcd: positive.default(26),
  holeDiameter: positive.default(3),
}

export const antiBacklashNutModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateAntiBacklashNutProps)
  .transform(normalizeAntiBacklashNutProps)

export const antiBacklashNutModelDefinitionSchema = z
  .object({ fn: z.literal("antibacklashnut"), ...shape })
  .strict()
  .superRefine(validateAntiBacklashNutProps)
  .transform(normalizeAntiBacklashNutProps)

export type AntiBacklashNutModelPropsInput = z.input<
  typeof antiBacklashNutModelPropsSchema
>
export type AntiBacklashNutModelProps = z.output<
  typeof antiBacklashNutModelPropsSchema
>
export type AntiBacklashNutModelDefinition = z.output<
  typeof antiBacklashNutModelDefinitionSchema
>
