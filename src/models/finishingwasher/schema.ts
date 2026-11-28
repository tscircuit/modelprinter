import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateFinishingWasherProps } from "./validate"

const shape = {
  custom: z.literal(true).default(true),
  innerDiameter: positive.default(4.5),
  outerDiameter: positive.default(12),
  height: positive.default(3),
  stripThickness: positive.default(0.8),
  cup: z.literal(true).default(true),
  seatAngleDeg: z.number().finite().gt(0).lt(180).default(90),
  rimWidth: positive.default(1),
}

export const finishingWasherModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateFinishingWasherProps)

export const finishingWasherModelDefinitionSchema = z
  .object({ fn: z.literal("finishingwasher"), ...shape })
  .strict()
  .superRefine(validateFinishingWasherProps)

export type FinishingWasherModelPropsInput = z.input<
  typeof finishingWasherModelPropsSchema
>
export type FinishingWasherModelProps = z.output<
  typeof finishingWasherModelPropsSchema
>
export type FinishingWasherModelDefinition = z.output<
  typeof finishingWasherModelDefinitionSchema
>
