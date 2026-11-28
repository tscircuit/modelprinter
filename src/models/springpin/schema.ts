import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { normalizeSpringPinProps } from "./normalize"
import { validateSpringPinProps } from "./validate"

const shape = {
  iso8752: z.literal(true).default(true),
  holeDiameter: positive,
  length: positive,
  free: z.literal(true).default(true),
}

export const springPinModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateSpringPinProps)
  .transform(normalizeSpringPinProps)

export const springPinModelDefinitionSchema = z
  .object({ fn: z.literal("springpin"), ...shape })
  .strict()
  .superRefine(validateSpringPinProps)
  .transform(normalizeSpringPinProps)

export type SpringPinModelPropsInput = z.input<typeof springPinModelPropsSchema>
export type SpringPinModelProps = z.output<typeof springPinModelPropsSchema>
export type SpringPinModelDefinition = z.output<
  typeof springPinModelDefinitionSchema
>
