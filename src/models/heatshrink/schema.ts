import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateHeatShrinkProps } from "./validate"

const shape = {
  innerDiameter: positive.default(8),
  outerDiameter: positive.default(9),
  length: positive.default(30),
  squareEnds: z.literal(true).default(true),
  unshrunk: z.literal(true).default(true),
}

export const heatShrinkModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateHeatShrinkProps)

export const heatShrinkModelDefinitionSchema = z
  .object({ fn: z.literal("heatshrink"), ...shape })
  .strict()
  .superRefine(validateHeatShrinkProps)

export type HeatShrinkModelPropsInput = z.input<
  typeof heatShrinkModelPropsSchema
>
export type HeatShrinkModelProps = z.output<typeof heatShrinkModelPropsSchema>
export type HeatShrinkModelDefinition = z.output<
  typeof heatShrinkModelDefinitionSchema
>
