import { z } from "zod"
import {
  nonnegativeGearLengthSchema as nonNegative,
  positiveGearLengthSchema as positive,
} from "../../gear-parameter-schemas"
import { validateSteppedShaftProps } from "./validate"

const shape = {
  diameter: positive.default(20),
  endDiameter: positive.default(12),
  length: positive.default(150),
  endLength: positive.default(25),
  shoulderFillet: nonNegative.default(1),
  endChamfer: nonNegative.default(1),
}

export const steppedShaftModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateSteppedShaftProps)

export const steppedShaftModelDefinitionSchema = z
  .object({ fn: z.literal("steppedshaft"), ...shape })
  .strict()
  .superRefine(validateSteppedShaftProps)

export type SteppedShaftModelPropsInput = z.input<
  typeof steppedShaftModelPropsSchema
>
export type SteppedShaftModelProps = z.output<
  typeof steppedShaftModelPropsSchema
>
export type SteppedShaftModelDefinition = z.output<
  typeof steppedShaftModelDefinitionSchema
>
