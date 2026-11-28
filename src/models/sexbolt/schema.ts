import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { normalizeSexBoltProps } from "./normalize"
import { validateSexBoltProps } from "./validate"

const shape = {
  custom: z.literal(true).default(true),
  thread: z
    .string()
    .regex(/^m(?:\d+(?:\.\d+)?)$/i)
    .default("m4"),
  barrelOuterDiameter: positive.default(6),
  barrelLength: positive.default(10),
  flangeOuterDiameter: positive.default(10),
  flangeHeight: positive.default(1.5),
  screwLength: positive.default(8),
  slotted: z.literal(true).default(true),
  slotWidth: positive.default(1),
  slotDepth: positive.default(0.8),
}

export const sexBoltModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateSexBoltProps)
  .transform(normalizeSexBoltProps)

export const sexBoltModelDefinitionSchema = z
  .object({ fn: z.literal("sexbolt"), ...shape })
  .strict()
  .superRefine(validateSexBoltProps)
  .transform(normalizeSexBoltProps)

export type SexBoltModelPropsInput = z.input<typeof sexBoltModelPropsSchema>
export type SexBoltModelProps = z.output<typeof sexBoltModelPropsSchema>
export type SexBoltModelDefinition = z.output<
  typeof sexBoltModelDefinitionSchema
>
