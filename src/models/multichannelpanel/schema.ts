import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateMultiChannelPanelProps } from "./validate"

const shape = {
  length: positive.default(200),
  width: positive.default(100),
  thickness: positive.default(8),
  skinThickness: positive.default(1),
  webThickness: positive.default(1),
  pitch: positive.default(10),
  channels: z.number().int().min(2).default(10),
}

export const multiChannelPanelModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateMultiChannelPanelProps)

export const multiChannelPanelModelDefinitionSchema = z
  .object({ fn: z.literal("multichannelpanel"), ...shape })
  .strict()
  .superRefine(validateMultiChannelPanelProps)

export type MultiChannelPanelModelPropsInput = z.input<
  typeof multiChannelPanelModelPropsSchema
>
export type MultiChannelPanelModelProps = z.output<
  typeof multiChannelPanelModelPropsSchema
>
export type MultiChannelPanelModelDefinition = z.output<
  typeof multiChannelPanelModelDefinitionSchema
>
