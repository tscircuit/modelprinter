import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { normalizeRelayBaseProps } from "./normalize"
import { validateRelayBaseProps } from "./validate"

const shape = {
  width: positive.default(25),
  depth: positive.default(40),
  height: positive.default(20),
  socketPins: z.union([z.literal(8), z.literal(11)]).default(8),
  socketPcd: positive.default(11),
  th35x75: z.literal(true).default(true),
  sideScrewTerminals: z.literal(true).default(true),
  screwThread: z
    .string()
    .regex(/^m(?:\d+(?:\.\d+)?)$/i)
    .default("m3"),
}

export const relayBaseModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateRelayBaseProps)
  .transform(normalizeRelayBaseProps)

export const relayBaseModelDefinitionSchema = z
  .object({ fn: z.literal("relaybase"), ...shape })
  .strict()
  .superRefine(validateRelayBaseProps)
  .transform(normalizeRelayBaseProps)

export type RelayBaseModelPropsInput = z.input<typeof relayBaseModelPropsSchema>
export type RelayBaseModelProps = z.output<typeof relayBaseModelPropsSchema>
export type RelayBaseModelDefinition = z.output<
  typeof relayBaseModelDefinitionSchema
>
