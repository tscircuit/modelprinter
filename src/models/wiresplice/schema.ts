import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateWireSpliceProps } from "./validate"

const shape = {
  width: positive.default(18),
  height: positive.default(12),
  depth: positive.default(20),
  ports: z.number().int().min(2).max(8).default(3),
  portInnerDiameter: positive.default(3),
  portPitch: positive.default(5),
  levers: z.number().int().min(2).max(8).default(3),
  snapBracket: z.literal(true).default(true),
}

export const wireSpliceModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateWireSpliceProps)

export const wireSpliceModelDefinitionSchema = z
  .object({ fn: z.literal("wiresplice"), ...shape })
  .strict()
  .superRefine(validateWireSpliceProps)

export type WireSpliceModelPropsInput = z.input<
  typeof wireSpliceModelPropsSchema
>
export type WireSpliceModelProps = z.output<typeof wireSpliceModelPropsSchema>
export type WireSpliceModelDefinition = z.output<
  typeof wireSpliceModelDefinitionSchema
>
