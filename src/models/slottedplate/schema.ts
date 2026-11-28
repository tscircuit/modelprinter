import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateSlottedPlateProps } from "./validate"

const shape = {
  length: positive.default(200),
  width: positive.default(100),
  thickness: positive.default(2),
  slotLength: positive.default(10),
  slotWidth: positive.default(3),
  pitchX: positive.default(15),
  pitchY: positive.default(10),
  edgeX: positive.default(10),
  edgeY: positive.default(10),
}

export const slottedPlateModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateSlottedPlateProps)

export const slottedPlateModelDefinitionSchema = z
  .object({ fn: z.literal("slottedplate"), ...shape })
  .strict()
  .superRefine(validateSlottedPlateProps)

export type SlottedPlateModelPropsInput = z.input<
  typeof slottedPlateModelPropsSchema
>
export type SlottedPlateModelProps = z.output<
  typeof slottedPlateModelPropsSchema
>
export type SlottedPlateModelDefinition = z.output<
  typeof slottedPlateModelDefinitionSchema
>
