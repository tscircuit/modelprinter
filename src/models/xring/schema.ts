import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateXRingProps } from "./validate"

const shape = {
  innerDiameter: positive.default(20),
  crossSectionDiameter: positive.default(2),
  quadrilobe: z.literal(true).default(true),
  lobes: z.literal(4).default(4),
  lobeRadius: positive.default(0.6),
}

export const xRingModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateXRingProps)

export const xRingModelDefinitionSchema = z
  .object({ fn: z.literal("xring"), ...shape })
  .strict()
  .superRefine(validateXRingProps)

export type XRingModelPropsInput = z.input<typeof xRingModelPropsSchema>
export type XRingModelProps = z.output<typeof xRingModelPropsSchema>
export type XRingModelDefinition = z.output<typeof xRingModelDefinitionSchema>
