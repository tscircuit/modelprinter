import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateEdgeClipProps } from "./validate"

const shape = {
  width: positive.default(12),
  length: positive.default(18),
  stripThickness: positive.default(0.8),
  panelGap: positive.default(2),
  barbs: z.number().int().min(2).max(8).default(4),
  barbLength: positive.default(3),
  barbHeight: positive.default(0.8),
  uForm: z.literal(true).default(true),
}

export const edgeClipModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateEdgeClipProps)

export const edgeClipModelDefinitionSchema = z
  .object({ fn: z.literal("edgeclip"), ...shape })
  .strict()
  .superRefine(validateEdgeClipProps)

export type EdgeClipModelPropsInput = z.input<typeof edgeClipModelPropsSchema>
export type EdgeClipModelProps = z.output<typeof edgeClipModelPropsSchema>
export type EdgeClipModelDefinition = z.output<
  typeof edgeClipModelDefinitionSchema
>
