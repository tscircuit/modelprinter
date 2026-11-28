import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateSpeedNutProps } from "./validate"

const shape = {
  threadDiameter: positive.default(4),
  width: positive.default(10),
  length: positive.default(14),
  stripThickness: positive.default(0.6),
  tabs: z.literal(2).default(2),
  tabHeight: positive.default(1.5),
  tabWidth: positive.default(3),
  vBend: z.literal(true).default(true),
}

export const speedNutModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateSpeedNutProps)

export const speedNutModelDefinitionSchema = z
  .object({ fn: z.literal("speednut"), ...shape })
  .strict()
  .superRefine(validateSpeedNutProps)

export type SpeedNutModelPropsInput = z.input<typeof speedNutModelPropsSchema>
export type SpeedNutModelProps = z.output<typeof speedNutModelPropsSchema>
export type SpeedNutModelDefinition = z.output<
  typeof speedNutModelDefinitionSchema
>
