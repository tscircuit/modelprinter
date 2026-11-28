import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateGenevaWheelProps } from "./validate"

const shape = {
  outerDiameter: positive.default(60),
  width: positive.default(10),
  boreDiameter: positive.default(8),
  slots: z.number().int().min(3).default(6),
  keyway: z.literal(true).default(true),
  keyWidth: positive.default(3),
  slotWidth: positive.default(6),
  lockRadius: positive.default(20),
}

export const genevaWheelModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateGenevaWheelProps)

export const genevaWheelModelDefinitionSchema = z
  .object({ fn: z.literal("genevawheel"), ...shape })
  .strict()
  .superRefine(validateGenevaWheelProps)

export type GenevaWheelModelPropsInput = z.input<
  typeof genevaWheelModelPropsSchema
>
export type GenevaWheelModelProps = z.output<typeof genevaWheelModelPropsSchema>
export type GenevaWheelModelDefinition = z.output<
  typeof genevaWheelModelDefinitionSchema
>
