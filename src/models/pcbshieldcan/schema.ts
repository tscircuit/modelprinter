import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateShieldCanProps } from "./validate"

const shape = {
  width: positive.default(30),
  depth: positive.default(20),
  height: positive.default(6),
  wallThickness: positive.default(0.3),
  tabs: z.number().int().min(4).max(32).default(8),
  tabWidth: positive.default(2),
  tabHeight: positive.default(1),
  topStyle: z.enum(["closedtop", "openframe"]).default("closedtop"),
}

export const shieldCanModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateShieldCanProps)

export const shieldCanModelDefinitionSchema = z
  .object({ fn: z.literal("pcbshieldcan"), ...shape })
  .strict()
  .superRefine(validateShieldCanProps)

export type ShieldCanModelPropsInput = z.input<typeof shieldCanModelPropsSchema>
export type ShieldCanModelProps = z.output<typeof shieldCanModelPropsSchema>
export type ShieldCanModelDefinition = z.output<
  typeof shieldCanModelDefinitionSchema
>
