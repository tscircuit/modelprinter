import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateLedHeatsinkProps } from "./validate"

const shape = {
  outerDiameter: positive.default(50),
  height: positive.default(20),
  baseThickness: positive.default(3),
  seatOuterDiameter: positive.default(20),
  fins: z.number().int().min(4).default(16),
  finThickness: positive.default(1),
  holes: z.literal(2).default(2),
  holeDiameter: positive.default(3),
  holePitch: positive.default(16),
}

export const ledHeatsinkModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateLedHeatsinkProps)

export const ledHeatsinkModelDefinitionSchema = z
  .object({ fn: z.literal("ledheatsink"), ...shape })
  .strict()
  .superRefine(validateLedHeatsinkProps)

export type LedHeatsinkModelPropsInput = z.input<
  typeof ledHeatsinkModelPropsSchema
>
export type LedHeatsinkModelProps = z.output<typeof ledHeatsinkModelPropsSchema>
export type LedHeatsinkModelDefinition = z.output<
  typeof ledHeatsinkModelDefinitionSchema
>
