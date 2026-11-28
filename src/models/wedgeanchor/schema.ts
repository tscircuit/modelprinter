import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateWedgeAnchorProps } from "./validate"

const shape = {
  threadDiameter: positive.default(8),
  length: positive.default(75),
  threadLength: positive.default(30),
  clipOuterDiameter: positive.default(10),
  clipLength: positive.default(12),
  coneOuterDiameter: positive.default(10),
  coneLength: positive.default(10),
  headless: z.literal(true).default(true),
  unset: z.literal(true).default(true),
}

export const wedgeAnchorModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateWedgeAnchorProps)

export const wedgeAnchorModelDefinitionSchema = z
  .object({ fn: z.literal("wedgeanchor"), ...shape })
  .strict()
  .superRefine(validateWedgeAnchorProps)

export type WedgeAnchorModelPropsInput = z.input<
  typeof wedgeAnchorModelPropsSchema
>
export type WedgeAnchorModelProps = z.output<typeof wedgeAnchorModelPropsSchema>
export type WedgeAnchorModelDefinition = z.output<
  typeof wedgeAnchorModelDefinitionSchema
>
