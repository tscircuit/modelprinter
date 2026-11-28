import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { normalizeDinRailEndStopProps } from "./normalize"
import { validateDinRailEndStopProps } from "./validate"

const shape = {
  th35x75: z.literal(true).default(true),
  width: positive.default(10),
  depth: positive.default(35),
  height: positive.default(30),
  clampThread: z
    .string()
    .regex(/^m(?:\d+(?:\.\d+)?)$/i)
    .default("m4"),
  jawGap: positive.default(35),
  screwClamp: z.literal(true).default(true),
}

export const dinRailEndStopModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateDinRailEndStopProps)
  .transform(normalizeDinRailEndStopProps)

export const dinRailEndStopModelDefinitionSchema = z
  .object({ fn: z.literal("dinrailendstop"), ...shape })
  .strict()
  .superRefine(validateDinRailEndStopProps)
  .transform(normalizeDinRailEndStopProps)

export type DinRailEndStopModelPropsInput = z.input<
  typeof dinRailEndStopModelPropsSchema
>
export type DinRailEndStopModelProps = z.output<
  typeof dinRailEndStopModelPropsSchema
>
export type DinRailEndStopModelDefinition = z.output<
  typeof dinRailEndStopModelDefinitionSchema
>
