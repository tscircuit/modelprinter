import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { normalizeGroundingBusbarProps } from "./normalize"
import { validateGroundingBusbarProps } from "./validate"

const shape = {
  length: positive.default(80),
  width: positive.default(15),
  thickness: positive.default(5),
  bores: z.number().int().min(1).default(8),
  boreDiameter: positive.default(4),
  pitch: positive.default(8),
  screwThread: z
    .string()
    .regex(/^m(?:\d+(?:\.\d+)?)$/i)
    .default("m4"),
  mounts: z.literal(2).default(2),
  holeDiameter: positive.default(4),
  holePitch: positive.default(68),
}

export const groundingBusbarModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateGroundingBusbarProps)
  .transform(normalizeGroundingBusbarProps)

export const groundingBusbarModelDefinitionSchema = z
  .object({ fn: z.literal("groundingbusbar"), ...shape })
  .strict()
  .superRefine(validateGroundingBusbarProps)
  .transform(normalizeGroundingBusbarProps)

export type GroundingBusbarModelPropsInput = z.input<
  typeof groundingBusbarModelPropsSchema
>
export type GroundingBusbarModelProps = z.output<
  typeof groundingBusbarModelPropsSchema
>
export type GroundingBusbarModelDefinition = z.output<
  typeof groundingBusbarModelDefinitionSchema
>
