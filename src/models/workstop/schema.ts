import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateWorkStopProps } from "./validate"

const shape = {
  baseLength: positive.default(60),
  baseWidth: positive.default(30),
  baseThickness: positive.default(10),
  armLength: positive.default(80),
  armDiameter: positive.default(12),
  tipDiameter: positive.default(6),
  tipLength: positive.default(20),
  mountHoles: z.number().int().min(1).max(6).default(2),
  holeDiameter: positive.default(6.6),
  holePitch: positive.default(40),
}

export const workStopModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateWorkStopProps)

export const workStopModelDefinitionSchema = z
  .object({ fn: z.literal("workstop"), ...shape })
  .strict()
  .superRefine(validateWorkStopProps)

export type WorkStopModelPropsInput = z.input<typeof workStopModelPropsSchema>
export type WorkStopModelProps = z.output<typeof workStopModelPropsSchema>
export type WorkStopModelDefinition = z.output<
  typeof workStopModelDefinitionSchema
>
