import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateHitchPinProps } from "./validate"

const shape = {
  custom: z.literal(true).default(true),
  diameter: positive,
  workingLength: positive,
  bentHead: z.literal(true).default(true),
  handleLength: positive,
  bendRadius: positive,
  crossHoleDiameter: positive,
  crossHoleOffset: positive,
  chamferTip: z.literal(true).default(true),
  tipChamfer: positive.default(0.5),
}

export const hitchPinModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateHitchPinProps)

export const hitchPinModelDefinitionSchema = z
  .object({ fn: z.literal("hitchpin"), ...shape })
  .strict()
  .superRefine(validateHitchPinProps)

export type HitchPinModelPropsInput = z.input<typeof hitchPinModelPropsSchema>
export type HitchPinModelProps = z.output<typeof hitchPinModelPropsSchema>
export type HitchPinModelDefinition = z.output<
  typeof hitchPinModelDefinitionSchema
>
