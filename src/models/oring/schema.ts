import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { normalizeORingProps } from "./normalize"
import { validateORingProps } from "./validate"

const shape = {
  as568: z.literal(true).default(true),
  size: z.string().regex(/^\d{1,3}$/, "AS568 dash size must be 1 to 3 digits"),
  round: z.literal(true).default(true),
  innerDiameter: positive.optional(),
  crossSectionDiameter: positive.optional(),
}

export const oRingModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateORingProps)
  .transform(normalizeORingProps)

export const oRingModelDefinitionSchema = z
  .object({ fn: z.literal("oring"), ...shape })
  .strict()
  .superRefine(validateORingProps)
  .transform(normalizeORingProps)

export type ORingModelPropsInput = z.input<typeof oRingModelPropsSchema>
export type ORingModelProps = z.output<typeof oRingModelPropsSchema>
export type ORingModelDefinition = z.output<typeof oRingModelDefinitionSchema>
