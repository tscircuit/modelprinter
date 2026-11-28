import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateConicalSpringWasherProps } from "./validate"

const shape = {
  innerDiameter: positive.default(6.2),
  outerDiameter: positive.default(14),
  stripThickness: positive.default(1),
  freeHeight: positive.default(2),
  conical: z.literal(true).default(true),
  freeState: z.literal(true).default(true),
}

export const conicalSpringWasherModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateConicalSpringWasherProps)

export const conicalSpringWasherModelDefinitionSchema = z
  .object({ fn: z.literal("conicalspringwasher"), ...shape })
  .strict()
  .superRefine(validateConicalSpringWasherProps)

export type ConicalSpringWasherModelPropsInput = z.input<
  typeof conicalSpringWasherModelPropsSchema
>
export type ConicalSpringWasherModelProps = z.output<
  typeof conicalSpringWasherModelPropsSchema
>
export type ConicalSpringWasherModelDefinition = z.output<
  typeof conicalSpringWasherModelDefinitionSchema
>
