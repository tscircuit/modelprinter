import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateInductiveSensorProps } from "./validate"

const shape = {
  threadOuterDiameter: positive.default(12),
  threadPitch: positive.default(1),
  length: positive.default(50),
  faceOuterDiameter: positive.default(10),
  cableOuterDiameter: positive.default(5),
  cableLength: positive.default(20),
  nuts: z.number().int().min(0).max(4).default(2),
  flushFront: z.boolean().default(true),
}

export const inductiveSensorModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateInductiveSensorProps)

export const inductiveSensorModelDefinitionSchema = z
  .object({ fn: z.literal("inductivesensor"), ...shape })
  .strict()
  .superRefine(validateInductiveSensorProps)

export type InductiveSensorModelPropsInput = z.input<
  typeof inductiveSensorModelPropsSchema
>
export type InductiveSensorModelProps = z.output<
  typeof inductiveSensorModelPropsSchema
>
export type InductiveSensorModelDefinition = z.output<
  typeof inductiveSensorModelDefinitionSchema
>
