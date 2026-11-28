import { z } from "zod"
import {
  nonnegativeGearLengthSchema as nonnegative,
  positiveGearLengthSchema as positive,
} from "../../gear-parameter-schemas"
import { validateCircularBlankProps } from "./validate"

const shape = {
  diameter: positive.default(80),
  thickness: positive.default(10),
  rimRadius: nonnegative.default(0),
}

export const circularBlankModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateCircularBlankProps)

export const circularBlankModelDefinitionSchema = z
  .object({ fn: z.literal("circularblank"), ...shape })
  .strict()
  .superRefine(validateCircularBlankProps)

export type CircularBlankModelPropsInput = z.input<
  typeof circularBlankModelPropsSchema
>
export type CircularBlankModelProps = z.output<
  typeof circularBlankModelPropsSchema
>
export type CircularBlankModelDefinition = z.output<
  typeof circularBlankModelDefinitionSchema
>
