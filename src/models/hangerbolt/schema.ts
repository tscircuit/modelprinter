import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { normalizeHangerBoltProps } from "./normalize"
import { validateHangerBoltProps } from "./validate"

const shape = {
  custom: z.literal(true).default(true),
  thread: z
    .string()
    .regex(/^m(?:\d+(?:\.\d+)?)$/i)
    .default("m6"),
  length: positive.default(50),
  machineThreadLength: positive.default(25),
  woodDiameter: positive.default(6),
  woodThreadPitch: positive.default(2.6),
  woodThreadLength: positive.default(25),
  centerFlats: z.literal(true).default(true),
  flats: z.literal(2).default(2),
  acrossFlats: positive.default(5),
  flatLength: positive.default(4),
  coneTip: z.literal(true).default(true),
}

export const hangerBoltModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateHangerBoltProps)
  .transform(normalizeHangerBoltProps)

export const hangerBoltModelDefinitionSchema = z
  .object({ fn: z.literal("hangerbolt"), ...shape })
  .strict()
  .superRefine(validateHangerBoltProps)
  .transform(normalizeHangerBoltProps)

export type HangerBoltModelPropsInput = z.input<
  typeof hangerBoltModelPropsSchema
>
export type HangerBoltModelProps = z.output<typeof hangerBoltModelPropsSchema>
export type HangerBoltModelDefinition = z.output<
  typeof hangerBoltModelDefinitionSchema
>
