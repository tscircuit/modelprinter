import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { normalizeShaftEndSupportProps } from "./normalize"
import { validateShaftEndSupportProps } from "./validate"

const shape = {
  boreDiameter: positive.default(16),
  width: positive.default(40),
  height: positive.default(50),
  depth: positive.default(15),
  base2Hole: z.literal(true).default(true),
  holePitch: positive.default(30),
  holeDiameter: positive.default(5),
  clampThread: z
    .string()
    .regex(/^m(?:\d+(?:\.\d+)?)$/i)
    .default("m5"),
}

export const shaftEndSupportModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateShaftEndSupportProps)
  .transform(normalizeShaftEndSupportProps)

export const shaftEndSupportModelDefinitionSchema = z
  .object({ fn: z.literal("shaftendsupport"), ...shape })
  .strict()
  .superRefine(validateShaftEndSupportProps)
  .transform(normalizeShaftEndSupportProps)

export type ShaftEndSupportModelPropsInput = z.input<
  typeof shaftEndSupportModelPropsSchema
>
export type ShaftEndSupportModelProps = z.output<
  typeof shaftEndSupportModelPropsSchema
>
export type ShaftEndSupportModelDefinition = z.output<
  typeof shaftEndSupportModelDefinitionSchema
>
