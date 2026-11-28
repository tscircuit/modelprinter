import { z } from "zod"
import {
  nonnegativeGearLengthSchema as nonNegative,
  positiveGearLengthSchema as positive,
} from "../../gear-parameter-schemas"
import { validateVaporChamberProps } from "./validate"

const shape = {
  width: positive.default(50),
  length: positive.default(80),
  height: positive.default(3),
  cornerRadius: nonNegative.default(3),
  tabs: z.literal(4).default(4),
  tabWidth: positive.default(8),
  holeDiameter: positive.default(3),
  holePitchX: positive.default(60),
  holePitchY: positive.default(70),
}

export const vaporChamberModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateVaporChamberProps)

export const vaporChamberModelDefinitionSchema = z
  .object({ fn: z.literal("vaporchamber"), ...shape })
  .strict()
  .superRefine(validateVaporChamberProps)

export type VaporChamberModelPropsInput = z.input<
  typeof vaporChamberModelPropsSchema
>
export type VaporChamberModelProps = z.output<
  typeof vaporChamberModelPropsSchema
>
export type VaporChamberModelDefinition = z.output<
  typeof vaporChamberModelDefinitionSchema
>
