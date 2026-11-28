import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateCableConduitProps } from "./validate"

const shape = {
  outerDiameter: positive.default(20),
  innerDiameter: positive.default(16),
  length: positive.default(100),
  pitch: positive.default(4),
  ribDepth: positive.default(1),
  roundCorrugated: z.literal(true).default(true),
}

export const cableConduitModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateCableConduitProps)

export const cableConduitModelDefinitionSchema = z
  .object({ fn: z.literal("cableconduit"), ...shape })
  .strict()
  .superRefine(validateCableConduitProps)

export type CableConduitModelPropsInput = z.input<
  typeof cableConduitModelPropsSchema
>
export type CableConduitModelProps = z.output<
  typeof cableConduitModelPropsSchema
>
export type CableConduitModelDefinition = z.output<
  typeof cableConduitModelDefinitionSchema
>
