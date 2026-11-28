import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateShelfSupportClipProps } from "./validate"

const shape = {
  height: positive.default(40),
  width: positive.default(25),
  length: positive.default(30),
  thickness: positive.default(2),
  hooks: z.number().int().min(1).max(4).default(2),
  hookPitch: positive.default(20),
  hookWidth: positive.default(6),
  hookHeight: positive.default(8),
  hookDepth: positive.default(5),
  throat: positive.default(2.5),
  ledgeLength: positive.default(20),
}

export const shelfSupportClipModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateShelfSupportClipProps)

export const shelfSupportClipModelDefinitionSchema = z
  .object({ fn: z.literal("shelfsupportclip"), ...shape })
  .strict()
  .superRefine(validateShelfSupportClipProps)

export type ShelfSupportClipModelPropsInput = z.input<
  typeof shelfSupportClipModelPropsSchema
>
export type ShelfSupportClipModelProps = z.output<
  typeof shelfSupportClipModelPropsSchema
>
export type ShelfSupportClipModelDefinition = z.output<
  typeof shelfSupportClipModelDefinitionSchema
>
