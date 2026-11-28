import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateDoubleBallBearingProps } from "./validate"

const shape = {
  innerDiameter: positive.default(20),
  outerDiameter: positive.default(47),
  width: positive.default(20),
  rows: z.literal(2).default(2),
  contactAngle: z.number().finite().min(0).max(45).default(0),
  open: z.literal(true).default(true),
}

export const doubleBallBearingModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateDoubleBallBearingProps)

export const doubleBallBearingModelDefinitionSchema = z
  .object({ fn: z.literal("doubleballbearing"), ...shape })
  .strict()
  .superRefine(validateDoubleBallBearingProps)

export type DoubleBallBearingModelPropsInput = z.input<
  typeof doubleBallBearingModelPropsSchema
>
export type DoubleBallBearingModelProps = z.output<
  typeof doubleBallBearingModelPropsSchema
>
export type DoubleBallBearingModelDefinition = z.output<
  typeof doubleBallBearingModelDefinitionSchema
>
