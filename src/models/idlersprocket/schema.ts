import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateIdlerSprocketProps } from "./validate"

const shape = {
  teeth: z.number().int().min(8).max(60).default(12),
  pitch: positive.default(12.7),
  boreDiameter: positive.default(8),
  toothWidth: positive.default(7.2),
  rollerDiameter: positive.default(7.92),
  tipOuterDiameter: positive.default(55),
  rootOuterDiameter: positive.default(41.2),
  strands: z.literal(1).default(1),
  rollerPocket: z.literal(true).default(true),
  bearingBore: z.literal(true).default(true),
}

export const idlerSprocketModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateIdlerSprocketProps)

export const idlerSprocketModelDefinitionSchema = z
  .object({ fn: z.literal("idlersprocket"), ...shape })
  .strict()
  .superRefine(validateIdlerSprocketProps)

export type IdlerSprocketModelPropsInput = z.input<
  typeof idlerSprocketModelPropsSchema
>
export type IdlerSprocketModelProps = z.output<
  typeof idlerSprocketModelPropsSchema
>
export type IdlerSprocketModelDefinition = z.output<
  typeof idlerSprocketModelDefinitionSchema
>
