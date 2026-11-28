import { z } from "zod"
import {
  nonnegativeGearLengthSchema as nonnegative,
  positiveGearLengthSchema as positive,
} from "../../gear-parameter-schemas"
import { validateAnnularBlankProps } from "./validate"

const shape = {
  outerDiameter: positive.default(80),
  innerDiameter: positive.default(40),
  thickness: positive.default(10),
  rimRadius: nonnegative.default(0),
}

export const annularBlankModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateAnnularBlankProps)

export const annularBlankModelDefinitionSchema = z
  .object({ fn: z.literal("annularblank"), ...shape })
  .strict()
  .superRefine(validateAnnularBlankProps)

export type AnnularBlankModelPropsInput = z.input<
  typeof annularBlankModelPropsSchema
>
export type AnnularBlankModelProps = z.output<
  typeof annularBlankModelPropsSchema
>
export type AnnularBlankModelDefinition = z.output<
  typeof annularBlankModelDefinitionSchema
>
