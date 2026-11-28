import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateClipNutProps } from "./validate"

const shape = {
  threadDiameter: positive.default(4),
  width: positive.default(12),
  length: positive.default(18),
  panelGap: positive.default(2),
  stripThickness: positive.default(0.8),
  holeOffset: positive.default(12),
  barrelOuterDiameter: positive.default(6),
  barrelHeight: positive.default(3),
  uForm: z.literal(true).default(true),
}

export const clipNutModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateClipNutProps)

export const clipNutModelDefinitionSchema = z
  .object({ fn: z.literal("clipnut"), ...shape })
  .strict()
  .superRefine(validateClipNutProps)

export type ClipNutModelPropsInput = z.input<typeof clipNutModelPropsSchema>
export type ClipNutModelProps = z.output<typeof clipNutModelPropsSchema>
export type ClipNutModelDefinition = z.output<
  typeof clipNutModelDefinitionSchema
>
