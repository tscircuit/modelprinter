import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateDrillPressViseProps } from "./validate"

const shape = {
  jawWidth: positive.default(75),
  jawHeight: positive.default(25),
  maxOpening: positive.default(80),
  bodyLength: positive.default(180),
  bodyWidth: positive.default(90),
  height: positive.default(45),
  mountSlots: z.number().int().min(2).max(8).default(4),
  slotWidth: positive.default(8),
  slotLength: positive.default(20),
  pitchX: positive.default(140),
  pitchY: positive.default(75),
}

export const drillPressViseModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateDrillPressViseProps)

export const drillPressViseModelDefinitionSchema = z
  .object({ fn: z.literal("drillpressvise"), ...shape })
  .strict()
  .superRefine(validateDrillPressViseProps)

export type DrillPressViseModelPropsInput = z.input<
  typeof drillPressViseModelPropsSchema
>
export type DrillPressViseModelProps = z.output<
  typeof drillPressViseModelPropsSchema
>
export type DrillPressViseModelDefinition = z.output<
  typeof drillPressViseModelDefinitionSchema
>
