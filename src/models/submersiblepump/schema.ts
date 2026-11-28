import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateSubmersiblePumpProps } from "./validate"

const shape = {
  bodyOuterDiameter: positive.default(90),
  height: positive.default(180),
  outletOuterDiameter: positive.default(25),
  baseOuterDiameter: positive.default(110),
  holes: z.number().int().min(2).max(8).default(3),
  boltCircleDiameter: positive.default(90),
  holeDiameter: positive.default(5),
  topBarb: z.boolean().default(true),
  baseFeet: z.boolean().default(true),
}

export const submersiblePumpModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateSubmersiblePumpProps)

export const submersiblePumpModelDefinitionSchema = z
  .object({ fn: z.literal("submersiblepump"), ...shape })
  .strict()
  .superRefine(validateSubmersiblePumpProps)

export type SubmersiblePumpModelPropsInput = z.input<
  typeof submersiblePumpModelPropsSchema
>
export type SubmersiblePumpModelProps = z.output<
  typeof submersiblePumpModelPropsSchema
>
export type SubmersiblePumpModelDefinition = z.output<
  typeof submersiblePumpModelDefinitionSchema
>
