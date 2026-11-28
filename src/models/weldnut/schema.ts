import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateWeldNutProps } from "./validate"

const shape = {
  threadDiameter: positive.default(6),
  width: positive.default(12),
  height: positive.default(5),
  projections: z.literal(4).default(4),
  projectionDiameter: positive.default(2),
  projectionHeight: positive.default(0.8),
  projectionPitch: positive.default(8),
  squareBody: z.literal(true).default(true),
}

export const weldNutModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateWeldNutProps)

export const weldNutModelDefinitionSchema = z
  .object({ fn: z.literal("weldnut"), ...shape })
  .strict()
  .superRefine(validateWeldNutProps)

export type WeldNutModelPropsInput = z.input<typeof weldNutModelPropsSchema>
export type WeldNutModelProps = z.output<typeof weldNutModelPropsSchema>
export type WeldNutModelDefinition = z.output<
  typeof weldNutModelDefinitionSchema
>
