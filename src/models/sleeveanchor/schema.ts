import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateSleeveAnchorProps } from "./validate"

const shape = {
  threadDiameter: positive.default(8),
  length: positive.default(65),
  sleeveOuterDiameter: positive.default(10),
  wallThickness: positive.default(1),
  sleeveLength: positive.default(45),
  slots: z.number().int().min(2).max(6).default(4),
  slotLength: positive.default(20),
  coneOuterDiameter: positive.default(10),
  acrossFlats: positive.default(13),
  hexHead: z.literal(true).default(true),
  unset: z.literal(true).default(true),
}

export const sleeveAnchorModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateSleeveAnchorProps)

export const sleeveAnchorModelDefinitionSchema = z
  .object({ fn: z.literal("sleeveanchor"), ...shape })
  .strict()
  .superRefine(validateSleeveAnchorProps)

export type SleeveAnchorModelPropsInput = z.input<
  typeof sleeveAnchorModelPropsSchema
>
export type SleeveAnchorModelProps = z.output<
  typeof sleeveAnchorModelPropsSchema
>
export type SleeveAnchorModelDefinition = z.output<
  typeof sleeveAnchorModelDefinitionSchema
>
