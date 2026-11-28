import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateWireDuctProps } from "./validate"

const shape = {
  innerWidth: positive.default(40),
  innerHeight: positive.default(40),
  length: positive.default(150),
  wallThickness: positive.default(2),
  slots: z.number().int().min(2).max(60).default(12),
  slotWidth: positive.default(6),
  slotPitch: positive.default(10),
  slotHeight: positive.default(28),
  holes: z.number().int().min(1).max(12).default(2),
  holeDiameter: positive.default(4),
  holePitch: positive.default(100),
}

export const wireDuctModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateWireDuctProps)

export const wireDuctModelDefinitionSchema = z
  .object({ fn: z.literal("wireduct"), ...shape })
  .strict()
  .superRefine(validateWireDuctProps)

export type WireDuctModelPropsInput = z.input<typeof wireDuctModelPropsSchema>
export type WireDuctModelProps = z.output<typeof wireDuctModelPropsSchema>
export type WireDuctModelDefinition = z.output<
  typeof wireDuctModelDefinitionSchema
>
