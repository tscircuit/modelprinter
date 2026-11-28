import { z } from "zod"
import {
  nonnegativeGearLengthSchema as nonNegative,
  positiveGearLengthSchema as positive,
} from "../../gear-parameter-schemas"
import { normalizeSquareNutProps } from "./normalize"
import { validateSquareNutProps } from "./validate"

const shape = {
  custom: z.literal(true).default(true),
  thread: z
    .string()
    .regex(/^m(?:\d+(?:\.\d+)?)$/i)
    .default("m6"),
  width: positive.default(10),
  height: positive.default(5),
  squareBody: z.literal(true).default(true),
  throughBore: z.literal(true).default(true),
  chamfer: nonNegative.default(0.5),
}

export const squareNutModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateSquareNutProps)
  .transform(normalizeSquareNutProps)

export const squareNutModelDefinitionSchema = z
  .object({ fn: z.literal("squarenut"), ...shape })
  .strict()
  .superRefine(validateSquareNutProps)
  .transform(normalizeSquareNutProps)

export type SquareNutModelPropsInput = z.input<typeof squareNutModelPropsSchema>
export type SquareNutModelProps = z.output<typeof squareNutModelPropsSchema>
export type SquareNutModelDefinition = z.output<
  typeof squareNutModelDefinitionSchema
>
