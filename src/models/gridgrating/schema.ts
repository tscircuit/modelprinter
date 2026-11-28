import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateGridGratingProps } from "./validate"

const shape = {
  length: positive.default(300),
  width: positive.default(200),
  bearingBarHeight: positive.default(25),
  bearingBarThickness: positive.default(3),
  bearingBarPitch: positive.default(25),
  crossBarThickness: positive.default(3),
  crossBarHeight: positive.default(5),
  crossBarPitch: positive.default(50),
}

export const gridGratingModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateGridGratingProps)

export const gridGratingModelDefinitionSchema = z
  .object({ fn: z.literal("gridgrating"), ...shape })
  .strict()
  .superRefine(validateGridGratingProps)

export type GridGratingModelPropsInput = z.input<
  typeof gridGratingModelPropsSchema
>
export type GridGratingModelProps = z.output<typeof gridGratingModelPropsSchema>
export type GridGratingModelDefinition = z.output<
  typeof gridGratingModelDefinitionSchema
>
