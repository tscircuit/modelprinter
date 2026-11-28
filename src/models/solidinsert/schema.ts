import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { normalizeSolidInsertProps } from "./normalize"
import { validateSolidInsertProps } from "./validate"

const shape = {
  custom: z.literal(true).default(true),
  internalThread: z
    .string()
    .regex(/^m(?:\d+(?:\.\d+)?)$/i)
    .default("m6"),
  externalDiameter: positive.default(10),
  externalThreadPitch: positive.default(1.5),
  length: positive.default(12),
  slotted: z.literal(true).default(true),
  slotWidth: positive.default(1),
  slotDepth: positive.default(1.5),
  through: z.literal(true).default(true),
}

export const solidInsertModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateSolidInsertProps)
  .transform(normalizeSolidInsertProps)

export const solidInsertModelDefinitionSchema = z
  .object({ fn: z.literal("solidinsert"), ...shape })
  .strict()
  .superRefine(validateSolidInsertProps)
  .transform(normalizeSolidInsertProps)

export type SolidInsertModelPropsInput = z.input<
  typeof solidInsertModelPropsSchema
>
export type SolidInsertModelProps = z.output<typeof solidInsertModelPropsSchema>
export type SolidInsertModelDefinition = z.output<
  typeof solidInsertModelDefinitionSchema
>
