import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateBondedSealingWasherProps } from "./validate"

const shape = {
  innerDiameter: positive.default(6),
  metalInnerDiameter: positive.default(8),
  outerDiameter: positive.default(14),
  metalHeight: positive.default(1.5),
  sealOuterDiameter: positive.default(9),
  sealHeight: positive.default(2),
  doubleLip: z.literal(true).default(true),
}

export const bondedSealingWasherModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateBondedSealingWasherProps)

export const bondedSealingWasherModelDefinitionSchema = z
  .object({ fn: z.literal("bondedsealingwasher"), ...shape })
  .strict()
  .superRefine(validateBondedSealingWasherProps)

export type BondedSealingWasherModelPropsInput = z.input<
  typeof bondedSealingWasherModelPropsSchema
>
export type BondedSealingWasherModelProps = z.output<
  typeof bondedSealingWasherModelPropsSchema
>
export type BondedSealingWasherModelDefinition = z.output<
  typeof bondedSealingWasherModelDefinitionSchema
>
