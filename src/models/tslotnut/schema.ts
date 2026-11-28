import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateTSlotNutProps } from "./validate"

const shape = {
  threadDiameter: positive.default(6),
  width: positive.default(14),
  length: positive.default(20),
  height: positive.default(8),
  topWidth: positive.default(8),
  topHeight: positive.default(4),
  endStyle: z.enum(["flatends", "roundedends"]).default("flatends"),
  boreStyle: z.enum(["through", "blind"]).default("through"),
}

export const tSlotNutModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateTSlotNutProps)

export const tSlotNutModelDefinitionSchema = z
  .object({ fn: z.literal("tslotnut"), ...shape })
  .strict()
  .superRefine(validateTSlotNutProps)

export type TSlotNutModelPropsInput = z.input<typeof tSlotNutModelPropsSchema>
export type TSlotNutModelProps = z.output<typeof tSlotNutModelPropsSchema>
export type TSlotNutModelDefinition = z.output<
  typeof tSlotNutModelDefinitionSchema
>
