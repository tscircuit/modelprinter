import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateFanGuardProps } from "./validate"

const shape = {
  outerDiameter: positive.default(40),
  wireDiameter: positive.default(1),
  rings: z.number().int().min(2).default(3),
  ringOuterDiameters: z.array(positive).min(2).default([16, 28, 40]),
  spokes: z.number().int().min(2).default(4),
  tabs: z.literal(4).default(4),
  holeDiameter: positive.default(3.5),
  holePitchX: positive.default(32),
  holePitchY: positive.default(32),
}

export const fanGuardModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateFanGuardProps)

export const fanGuardModelDefinitionSchema = z
  .object({ fn: z.literal("fanguard"), ...shape })
  .strict()
  .superRefine(validateFanGuardProps)

export type FanGuardModelPropsInput = z.input<typeof fanGuardModelPropsSchema>
export type FanGuardModelProps = z.output<typeof fanGuardModelPropsSchema>
export type FanGuardModelDefinition = z.output<
  typeof fanGuardModelDefinitionSchema
>
