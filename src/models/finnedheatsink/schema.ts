import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateFinnedHeatsinkProps } from "./validate"

const shape = {
  width: positive.default(40),
  length: positive.default(50),
  baseThickness: positive.default(3),
  height: positive.default(20),
  finCount: z.number().int().min(2).max(64).default(8),
  finThickness: positive.default(1),
  finPitch: positive.default(5),
  holeCount: z.literal(2).default(2),
  holeDiameter: positive.default(3),
  holePitch: positive.default(40),
  longitudinal: z.boolean().default(true),
}

export const finnedHeatsinkModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateFinnedHeatsinkProps)

export const finnedHeatsinkModelDefinitionSchema = z
  .object({ fn: z.literal("finnedheatsink"), ...shape })
  .strict()
  .superRefine(validateFinnedHeatsinkProps)

export type FinnedHeatsinkModelPropsInput = z.input<
  typeof finnedHeatsinkModelPropsSchema
>
export type FinnedHeatsinkModelProps = z.output<
  typeof finnedHeatsinkModelPropsSchema
>
export type FinnedHeatsinkModelDefinition = z.output<
  typeof finnedHeatsinkModelDefinitionSchema
>
