import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { normalizeCoilInsertProps } from "./normalize"
import { validateCoilInsertProps } from "./validate"

const shape = {
  custom: z.literal(true).default(true),
  thread: z
    .string()
    .regex(/^m(?:\d+(?:\.\d+)?)$/i)
    .default("m3"),
  length: positive.default(4.5),
  outerDiameter: positive.default(3.7),
  turns: z.number().finite().gt(1).default(9),
  diamond: z.literal(true).default(true),
  wireWidth: positive.default(0.35),
  bentTang: z.literal(true).default(true),
  sectionAngle: z.number().finite().gt(0).lt(180).default(60),
}

export const coilInsertModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateCoilInsertProps)
  .transform(normalizeCoilInsertProps)

export const coilInsertModelDefinitionSchema = z
  .object({ fn: z.literal("coilinsert"), ...shape })
  .strict()
  .superRefine(validateCoilInsertProps)
  .transform(normalizeCoilInsertProps)

export type CoilInsertModelPropsInput = z.input<
  typeof coilInsertModelPropsSchema
>
export type CoilInsertModelProps = z.output<typeof coilInsertModelPropsSchema>
export type CoilInsertModelDefinition = z.output<
  typeof coilInsertModelDefinitionSchema
>
