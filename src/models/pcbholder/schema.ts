import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validatePcbHolderProps } from "./validate"

const shape = {
  boardSpan: positive.default(150),
  height: positive.default(80),
  jawWidth: positive.default(10),
  grooveWidth: positive.default(1.6),
  grooveDepth: positive.default(3),
  baseLength: positive.default(200),
  baseWidth: positive.default(60),
  mounts: z.number().int().min(2).max(8).default(4),
  holeDiameter: positive.default(5.5),
  pitchX: positive.default(170),
  pitchY: positive.default(40),
}

export const pcbHolderModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validatePcbHolderProps)

export const pcbHolderModelDefinitionSchema = z
  .object({ fn: z.literal("pcbholder"), ...shape })
  .strict()
  .superRefine(validatePcbHolderProps)

export type PcbHolderModelPropsInput = z.input<typeof pcbHolderModelPropsSchema>
export type PcbHolderModelProps = z.output<typeof pcbHolderModelPropsSchema>
export type PcbHolderModelDefinition = z.output<
  typeof pcbHolderModelDefinitionSchema
>
