import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateEdgeConnectorProps } from "./validate"

const shape = {
  pitch: positive.default(2.54),
  contacts: z.number().int().min(4).default(20),
  rows: z.literal(2).default(2),
  boardThickness: positive.default(1.6),
  length: positive.default(35),
  height: positive.default(12),
  depth: positive.default(8),
  throughHole: z.literal(true).default(true),
  topSlot: z.literal(true).default(true),
}

export const edgeConnectorModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateEdgeConnectorProps)

export const edgeConnectorModelDefinitionSchema = z
  .object({ fn: z.literal("edgeconnector"), ...shape })
  .strict()
  .superRefine(validateEdgeConnectorProps)

export type EdgeConnectorModelPropsInput = z.input<
  typeof edgeConnectorModelPropsSchema
>
export type EdgeConnectorModelProps = z.output<
  typeof edgeConnectorModelPropsSchema
>
export type EdgeConnectorModelDefinition = z.output<
  typeof edgeConnectorModelDefinitionSchema
>
