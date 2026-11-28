import { z } from "zod"
import {
  nonnegativeGearLengthSchema as nonNegative,
  positiveGearLengthSchema as positive,
} from "../../gear-parameter-schemas"
import { validateTriangularBarProps } from "./validate"

const shape = {
  sideLength: positive.default(20),
  length: positive.default(100),
  equilateral: z.literal(true).default(true),
  cornerRadius: nonNegative.default(0),
}

export const triangularBarModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateTriangularBarProps)

export const triangularBarModelDefinitionSchema = z
  .object({ fn: z.literal("triangularbar"), ...shape })
  .strict()
  .superRefine(validateTriangularBarProps)

export type TriangularBarModelPropsInput = z.input<
  typeof triangularBarModelPropsSchema
>
export type TriangularBarModelProps = z.output<
  typeof triangularBarModelPropsSchema
>
export type TriangularBarModelDefinition = z.output<
  typeof triangularBarModelDefinitionSchema
>
