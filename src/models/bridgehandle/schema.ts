import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { normalizeBridgeHandleProps } from "./normalize"
import { bridgeHandleMetricSizeSchema } from "./table"
import { validateBridgeHandleProps } from "./validate"

const shape = {
  pitch: positive.default(100),
  width: positive.default(20),
  height: positive.default(30),
  gripThickness: positive.default(8),
  footSize: z.tuple([positive, positive]).default([20, 20]),
  holeCount: z.literal(2).default(2),
  metricSize: bridgeHandleMetricSizeSchema.default("M5"),
  threadPitch: positive.optional(),
  rightHanded: z.literal(true).default(true),
  threadClass: z.literal("6H").default("6H"),
  showThreads: z.boolean().default(true),
}

export const bridgeHandleModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateBridgeHandleProps)
  .transform(normalizeBridgeHandleProps)

export const bridgeHandleModelDefinitionSchema = z
  .object({ fn: z.literal("bridgehandle"), ...shape })
  .strict()
  .superRefine(validateBridgeHandleProps)
  .transform(normalizeBridgeHandleProps)

export type BridgeHandleModelPropsInput = z.input<
  typeof bridgeHandleModelPropsSchema
>
export type BridgeHandleModelProps = z.output<
  typeof bridgeHandleModelPropsSchema
>
export type BridgeHandleModelDefinition = z.output<
  typeof bridgeHandleModelDefinitionSchema
>
