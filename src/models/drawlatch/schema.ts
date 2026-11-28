import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateDrawLatchProps } from "./validate"

const shape = {
  width: positive.default(20),
  length: positive.default(60),
  height: positive.default(15),
  sheetThickness: positive.default(2),
  loopWireDiameter: positive.default(2),
  catchWidth: positive.default(18),
  holeDiameter: positive.default(4),
  holePitchX: positive.default(12),
  holePitchY: positive.default(35),
  overCenter: z.literal(true).default(true),
}

export const drawLatchModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateDrawLatchProps)

export const drawLatchModelDefinitionSchema = z
  .object({ fn: z.literal("drawlatch"), ...shape })
  .strict()
  .superRefine(validateDrawLatchProps)

export type DrawLatchModelPropsInput = z.input<typeof drawLatchModelPropsSchema>
export type DrawLatchModelProps = z.output<typeof drawLatchModelPropsSchema>
export type DrawLatchModelDefinition = z.output<
  typeof drawLatchModelDefinitionSchema
>
