import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validatePawlProps } from "./validate"

const shape = {
  length: positive.default(35),
  width: positive.default(12),
  height: positive.default(8),
  pivotDiameter: positive.default(6),
  pivotBore: z.literal(true).default(true),
  noseAngleDeg: z.number().finite().default(20),
  noseRadius: positive.default(2),
}

export const pawlModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validatePawlProps)

export const pawlModelDefinitionSchema = z
  .object({ fn: z.literal("pawl"), ...shape })
  .strict()
  .superRefine(validatePawlProps)

export type PawlModelPropsInput = z.input<typeof pawlModelPropsSchema>
export type PawlModelProps = z.output<typeof pawlModelPropsSchema>
export type PawlModelDefinition = z.output<typeof pawlModelDefinitionSchema>
