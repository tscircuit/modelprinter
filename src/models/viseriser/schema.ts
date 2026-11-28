import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateViseRiserProps } from "./validate"

const shape = {
  length: positive.default(200),
  width: positive.default(120),
  height: positive.default(100),
  wallThickness: positive.default(12),
  coreLength: positive.default(176),
  coreWidth: positive.default(96),
  coreHeight: positive.default(76),
  topSeatWidth: positive.default(80),
  topSeatDepth: positive.default(5),
  mounts: z.number().int().min(2).max(8).default(4),
  holeDiameter: positive.default(12.5),
  pitchX: positive.default(170),
  pitchY: positive.default(90),
}

export const viseRiserModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateViseRiserProps)

export const viseRiserModelDefinitionSchema = z
  .object({ fn: z.literal("viseriser"), ...shape })
  .strict()
  .superRefine(validateViseRiserProps)

export type ViseRiserModelPropsInput = z.input<typeof viseRiserModelPropsSchema>
export type ViseRiserModelProps = z.output<typeof viseRiserModelPropsSchema>
export type ViseRiserModelDefinition = z.output<
  typeof viseRiserModelDefinitionSchema
>
