import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateCableSheaveProps } from "./validate"

const shape = {
  outerDiameter: positive.default(80),
  boreDiameter: positive.default(12),
  width: positive.default(20),
  grooveRadius: positive.default(4),
  uGroove: z.literal(true).default(true),
  bearingBore: z.literal(true).default(true),
  grooveDepth: positive.default(6),
}

export const cableSheaveModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateCableSheaveProps)

export const cableSheaveModelDefinitionSchema = z
  .object({ fn: z.literal("cablesheave"), ...shape })
  .strict()
  .superRefine(validateCableSheaveProps)

export type CableSheaveModelPropsInput = z.input<
  typeof cableSheaveModelPropsSchema
>
export type CableSheaveModelProps = z.output<typeof cableSheaveModelPropsSchema>
export type CableSheaveModelDefinition = z.output<
  typeof cableSheaveModelDefinitionSchema
>
