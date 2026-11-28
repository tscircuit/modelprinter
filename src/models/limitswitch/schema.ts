import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateLimitSwitchProps } from "./validate"

const shape = {
  width: positive.default(30),
  height: positive.default(65),
  depth: positive.default(25),
  leverLength: positive.default(40),
  rollerOuterDiameter: positive.default(12),
  pivotDiameter: positive.default(6),
  holes: z.number().int().min(2).max(4).default(2),
  holeDiameter: positive.default(4),
  holePitch: positive.default(50),
  entryDiameter: positive.default(16),
  entryPitch: positive.default(1.5),
}

export const limitSwitchModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateLimitSwitchProps)

export const limitSwitchModelDefinitionSchema = z
  .object({ fn: z.literal("limitswitch"), ...shape })
  .strict()
  .superRefine(validateLimitSwitchProps)

export type LimitSwitchModelPropsInput = z.input<
  typeof limitSwitchModelPropsSchema
>
export type LimitSwitchModelProps = z.output<typeof limitSwitchModelPropsSchema>
export type LimitSwitchModelDefinition = z.output<
  typeof limitSwitchModelDefinitionSchema
>
