import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateEClipProps } from "./validate"

const shape = {
  din6799: z.literal(true).default(true),
  shaftDiameter: positive,
  grooveDiameter: positive,
  free: z.literal(true).default(true),
}

export const eClipModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateEClipProps)

export const eClipModelDefinitionSchema = z
  .object({ fn: z.literal("eclip"), ...shape })
  .strict()
  .superRefine(validateEClipProps)

export type EClipModelPropsInput = z.input<typeof eClipModelPropsSchema>
export type EClipModelProps = z.output<typeof eClipModelPropsSchema>
export type EClipModelDefinition = z.output<typeof eClipModelDefinitionSchema>
