import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { normalizeCircuitBreakerProps } from "./normalize"
import { validateCircuitBreakerProps } from "./validate"

const shape = {
  width: positive.optional(),
  height: positive.default(85),
  depth: positive.default(70),
  poles: z
    .union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)])
    .default(1),
  th35x75Rail: z.literal(true).default(true),
  frontToggle: z.literal(true).default(true),
  topBottomTerminals: z.literal(true).default(true),
  stepped: z.literal(true).default(true),
}

export const circuitBreakerModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateCircuitBreakerProps)
  .transform(normalizeCircuitBreakerProps)

export const circuitBreakerModelDefinitionSchema = z
  .object({ fn: z.literal("circuitbreaker"), ...shape })
  .strict()
  .superRefine(validateCircuitBreakerProps)
  .transform(normalizeCircuitBreakerProps)

export type CircuitBreakerModelPropsInput = z.input<
  typeof circuitBreakerModelPropsSchema
>
export type CircuitBreakerModelProps = z.output<
  typeof circuitBreakerModelPropsSchema
>
export type CircuitBreakerModelDefinition = z.output<
  typeof circuitBreakerModelDefinitionSchema
>
