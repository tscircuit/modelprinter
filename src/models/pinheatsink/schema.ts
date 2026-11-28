import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validatePinHeatsinkProps } from "./validate"

const shape = {
  width: positive.default(30),
  length: positive.default(30),
  baseThickness: positive.default(3),
  height: positive.default(20),
  pinOuterDiameter: positive.default(3),
  gridX: z.number().int().min(2).default(4),
  gridY: z.number().int().min(2).default(4),
  pitch: positive.default(6),
  holes: z.literal(4).default(4),
  holeDiameter: positive.default(3),
  holePitchX: positive.default(24),
  holePitchY: positive.default(24),
}

export const pinHeatsinkModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validatePinHeatsinkProps)

export const pinHeatsinkModelDefinitionSchema = z
  .object({ fn: z.literal("pinheatsink"), ...shape })
  .strict()
  .superRefine(validatePinHeatsinkProps)

export type PinHeatsinkModelPropsInput = z.input<
  typeof pinHeatsinkModelPropsSchema
>
export type PinHeatsinkModelProps = z.output<typeof pinHeatsinkModelPropsSchema>
export type PinHeatsinkModelDefinition = z.output<
  typeof pinHeatsinkModelDefinitionSchema
>
