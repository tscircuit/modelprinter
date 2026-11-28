import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateClinchNutProps } from "./validate"

const shape = {
  threadDiameter: positive.default(4),
  outerDiameter: positive.default(7),
  height: positive.default(3),
  neckDiameter: positive.default(5),
  neckHeight: positive.default(1),
  flangeOuterDiameter: positive.default(8),
  flangeHeight: positive.default(1),
  serrations: z.number().int().min(6).max(36).default(12),
  serrationDepth: positive.default(0.3),
}

export const clinchNutModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateClinchNutProps)

export const clinchNutModelDefinitionSchema = z
  .object({ fn: z.literal("clinchnut"), ...shape })
  .strict()
  .superRefine(validateClinchNutProps)

export type ClinchNutModelPropsInput = z.input<typeof clinchNutModelPropsSchema>
export type ClinchNutModelProps = z.output<typeof clinchNutModelPropsSchema>
export type ClinchNutModelDefinition = z.output<
  typeof clinchNutModelDefinitionSchema
>
