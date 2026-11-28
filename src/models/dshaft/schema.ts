import { z } from "zod"
import {
  nonnegativeGearLengthSchema as nonNegative,
  positiveGearLengthSchema as positive,
} from "../../gear-parameter-schemas"
import { validateDShaftProps } from "./validate"

const shape = {
  diameter: positive.default(8),
  length: positive.default(100),
  flatDistance: nonNegative.default(1),
  flatLength: positive.default(90),
  endChamfer: nonNegative.default(0.5),
}

export const dShaftModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateDShaftProps)

export const dShaftModelDefinitionSchema = z
  .object({ fn: z.literal("dshaft"), ...shape })
  .strict()
  .superRefine(validateDShaftProps)

export type DShaftModelPropsInput = z.input<typeof dShaftModelPropsSchema>
export type DShaftModelProps = z.output<typeof dShaftModelPropsSchema>
export type DShaftModelDefinition = z.output<typeof dShaftModelDefinitionSchema>
