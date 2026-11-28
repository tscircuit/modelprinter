import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { normalizeHookBoltProps } from "./normalize"
import { validateHookBoltProps } from "./validate"

const shape = {
  custom: z.literal(true).default(true),
  thread: z
    .string()
    .regex(/^m(?:\d+(?:\.\d+)?)$/i)
    .default("m6"),
  straightLength: positive.default(50),
  threadLength: positive.default(25),
  hookInnerDiameter: positive.default(15),
  hookAngleDeg: z.number().finite().gt(0).lte(270).default(180),
  hookWireDiameter: positive.default(6),
  flatTip: z.literal(true).default(true),
}

export const hookBoltModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateHookBoltProps)
  .transform(normalizeHookBoltProps)

export const hookBoltModelDefinitionSchema = z
  .object({ fn: z.literal("hookbolt"), ...shape })
  .strict()
  .superRefine(validateHookBoltProps)
  .transform(normalizeHookBoltProps)

export type HookBoltModelPropsInput = z.input<typeof hookBoltModelPropsSchema>
export type HookBoltModelProps = z.output<typeof hookBoltModelPropsSchema>
export type HookBoltModelDefinition = z.output<
  typeof hookBoltModelDefinitionSchema
>
