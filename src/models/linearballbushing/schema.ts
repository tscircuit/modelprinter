import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateLinearBallBushingProps } from "./validate"

const shape = {
  innerDiameter: positive.default(8),
  outerDiameter: positive.default(15),
  length: positive.default(24),
  closedRecirculating: z.literal(true).default(true),
  circlipGrooves: z.number().int().min(0).max(2).default(2),
}

export const linearBallBushingModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateLinearBallBushingProps)

export const linearBallBushingModelDefinitionSchema = z
  .object({ fn: z.literal("linearballbushing"), ...shape })
  .strict()
  .superRefine(validateLinearBallBushingProps)

export type LinearBallBushingModelPropsInput = z.input<
  typeof linearBallBushingModelPropsSchema
>
export type LinearBallBushingModelProps = z.output<
  typeof linearBallBushingModelPropsSchema
>
export type LinearBallBushingModelDefinition = z.output<
  typeof linearBallBushingModelDefinitionSchema
>
