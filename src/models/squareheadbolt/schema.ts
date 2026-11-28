import { z } from "zod"
import {
  nonnegativeGearLengthSchema as nonNegative,
  positiveGearLengthSchema as positive,
} from "../../gear-parameter-schemas"
import { normalizeSquareHeadBoltProps } from "./normalize"
import { validateSquareHeadBoltProps } from "./validate"

const shape = {
  custom: z.literal(true).default(true),
  thread: z
    .string()
    .regex(/^m(?:\d+(?:\.\d+)?)$/i)
    .default("m6"),
  length: positive.default(30),
  threadLength: positive.default(18),
  headWidth: positive.default(10),
  headHeight: positive.default(4),
  squareHead: z.literal(true).default(true),
  squareDrive: z.literal(true).default(true),
  chamfer: nonNegative.default(0.5),
}

export const squareHeadBoltModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateSquareHeadBoltProps)
  .transform(normalizeSquareHeadBoltProps)

export const squareHeadBoltModelDefinitionSchema = z
  .object({ fn: z.literal("squareheadbolt"), ...shape })
  .strict()
  .superRefine(validateSquareHeadBoltProps)
  .transform(normalizeSquareHeadBoltProps)

export type SquareHeadBoltModelPropsInput = z.input<
  typeof squareHeadBoltModelPropsSchema
>
export type SquareHeadBoltModelProps = z.output<
  typeof squareHeadBoltModelPropsSchema
>
export type SquareHeadBoltModelDefinition = z.output<
  typeof squareHeadBoltModelDefinitionSchema
>
