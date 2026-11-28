import { z } from "zod"
import {
  nonnegativeGearLengthSchema as nonnegative,
  positiveGearLengthSchema as positive,
} from "../../gear-parameter-schemas"
import { validateParallelsProps } from "./validate"

const shape = {
  length: positive.default(100),
  height: positive.default(20),
  thickness: positive.default(5),
  pairGap: positive.default(50),
  edgeRadius: nonnegative.default(0),
}

export const parallelsModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateParallelsProps)

export const parallelsModelDefinitionSchema = z
  .object({ fn: z.literal("parallels"), ...shape })
  .strict()
  .superRefine(validateParallelsProps)

export type ParallelsModelPropsInput = z.input<typeof parallelsModelPropsSchema>
export type ParallelsModelProps = z.output<typeof parallelsModelPropsSchema>
export type ParallelsModelDefinition = z.output<
  typeof parallelsModelDefinitionSchema
>
