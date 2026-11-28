import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateSlottedTubeProps } from "./validate"

const shape = {
  outerDiameter: positive.default(25),
  wallThickness: positive.default(2),
  length: positive.default(100),
  slotWidth: positive.default(3),
  slotLength: positive.default(8),
  axialPitch: positive.default(10),
  rows: z.number().int().min(1).default(9),
  around: z.number().int().min(2).default(8),
  endMargin: positive.default(10),
}

export const slottedTubeModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateSlottedTubeProps)

export const slottedTubeModelDefinitionSchema = z
  .object({ fn: z.literal("slottedtube"), ...shape })
  .strict()
  .superRefine(validateSlottedTubeProps)

export type SlottedTubeModelPropsInput = z.input<
  typeof slottedTubeModelPropsSchema
>
export type SlottedTubeModelProps = z.output<typeof slottedTubeModelPropsSchema>
export type SlottedTubeModelDefinition = z.output<
  typeof slottedTubeModelDefinitionSchema
>
