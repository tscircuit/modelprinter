import { z } from "zod"
import {
  nonnegativeGearLengthSchema as nonNegative,
  positiveGearLengthSchema as positive,
} from "../../gear-parameter-schemas"
import { validateToroidalCoreProps } from "./validate"

const shape = {
  outerDiameter: positive.default(30),
  innerDiameter: positive.default(15),
  height: positive.default(10),
  edgeRadius: nonNegative.default(2),
  roundedRectangle: z.literal(true).default(true),
}

export const toroidalCoreModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateToroidalCoreProps)

export const toroidalCoreModelDefinitionSchema = z
  .object({ fn: z.literal("toroidalcore"), ...shape })
  .strict()
  .superRefine(validateToroidalCoreProps)

export type ToroidalCoreModelPropsInput = z.input<
  typeof toroidalCoreModelPropsSchema
>
export type ToroidalCoreModelProps = z.output<
  typeof toroidalCoreModelPropsSchema
>
export type ToroidalCoreModelDefinition = z.output<
  typeof toroidalCoreModelDefinitionSchema
>
