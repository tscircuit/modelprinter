import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateCorrugatedSheetProps } from "./validate"

const shape = {
  length: positive.default(300),
  width: positive.default(200),
  thickness: positive.default(1),
  pitch: positive.default(20),
  peakToPeak: positive.default(5),
  phaseAngle: z.number().min(-360).max(360).default(0),
  sineWave: z.literal(true).default(true),
}

export const corrugatedSheetModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateCorrugatedSheetProps)

export const corrugatedSheetModelDefinitionSchema = z
  .object({ fn: z.literal("corrugatedsheet"), ...shape })
  .strict()
  .superRefine(validateCorrugatedSheetProps)

export type CorrugatedSheetModelPropsInput = z.input<
  typeof corrugatedSheetModelPropsSchema
>
export type CorrugatedSheetModelProps = z.output<
  typeof corrugatedSheetModelPropsSchema
>
export type CorrugatedSheetModelDefinition = z.output<
  typeof corrugatedSheetModelDefinitionSchema
>
