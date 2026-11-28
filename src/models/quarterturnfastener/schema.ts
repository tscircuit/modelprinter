import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateQuarterTurnFastenerProps } from "./validate"

const shape = {
  shankDiameter: positive.default(6),
  length: positive.default(15),
  headOuterDiameter: positive.default(12),
  headHeight: positive.default(2),
  slotWidth: positive.default(1.5),
  slotDepth: positive.default(1),
  crossPinDiameter: positive.default(2),
  crossPinLength: positive.default(10),
  pinOffset: positive.default(3),
  slotted: z.literal(true).default(true),
}

export const quarterTurnFastenerModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateQuarterTurnFastenerProps)

export const quarterTurnFastenerModelDefinitionSchema = z
  .object({ fn: z.literal("quarterturnfastener"), ...shape })
  .strict()
  .superRefine(validateQuarterTurnFastenerProps)

export type QuarterTurnFastenerModelPropsInput = z.input<
  typeof quarterTurnFastenerModelPropsSchema
>
export type QuarterTurnFastenerModelProps = z.output<
  typeof quarterTurnFastenerModelPropsSchema
>
export type QuarterTurnFastenerModelDefinition = z.output<
  typeof quarterTurnFastenerModelDefinitionSchema
>
