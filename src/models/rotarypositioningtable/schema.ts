import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateRotaryPositioningTableProps } from "./validate"

const shape = {
  outerDiameter: positive.default(100),
  height: positive.default(40),
  boreDiameter: positive.default(20),
  tableBoltPcd: positive.default(60),
  baseBoltPcd: positive.default(80),
  holeDiameter: positive.default(5),
  tableThreadDiameter: positive.default(5),
  baseHoles: z.number().int().min(3).max(8).default(4),
}

export const rotaryPositioningTableModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateRotaryPositioningTableProps)

export const rotaryPositioningTableModelDefinitionSchema = z
  .object({ fn: z.literal("rotarypositioningtable"), ...shape })
  .strict()
  .superRefine(validateRotaryPositioningTableProps)

export type RotaryPositioningTableModelPropsInput = z.input<
  typeof rotaryPositioningTableModelPropsSchema
>
export type RotaryPositioningTableModelProps = z.output<
  typeof rotaryPositioningTableModelPropsSchema
>
export type RotaryPositioningTableModelDefinition = z.output<
  typeof rotaryPositioningTableModelDefinitionSchema
>
