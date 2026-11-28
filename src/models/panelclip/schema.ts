import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validatePanelClipProps } from "./validate"

const shape = {
  width: positive.default(12),
  length: positive.default(20),
  stripThickness: positive.default(0.8),
  panelGap: positive.default(3),
  legs: z.literal(2).default(2),
  barbs: z.number().int().min(2).max(8).default(4),
  barbLength: positive.default(2),
  barbHeight: positive.default(1),
  uForm: z.literal(true).default(true),
}

export const panelClipModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validatePanelClipProps)

export const panelClipModelDefinitionSchema = z
  .object({ fn: z.literal("panelclip"), ...shape })
  .strict()
  .superRefine(validatePanelClipProps)

export type PanelClipModelPropsInput = z.input<typeof panelClipModelPropsSchema>
export type PanelClipModelProps = z.output<typeof panelClipModelPropsSchema>
export type PanelClipModelDefinition = z.output<
  typeof panelClipModelDefinitionSchema
>
