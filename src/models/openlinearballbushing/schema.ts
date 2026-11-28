import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateOpenLinearBallBushingProps } from "./validate"

const shape = {
  innerDiameter: positive.default(16),
  outerDiameter: positive.default(26),
  length: positive.default(36),
  openRecirculating: z.literal(true).default(true),
  openingAngle: z.number().finite().gt(0).lt(180).default(60),
  circlipGrooves: z.number().int().min(0).max(2).default(2),
}

export const openLinearBallBushingModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateOpenLinearBallBushingProps)

export const openLinearBallBushingModelDefinitionSchema = z
  .object({ fn: z.literal("openlinearballbushing"), ...shape })
  .strict()
  .superRefine(validateOpenLinearBallBushingProps)

export type OpenLinearBallBushingModelPropsInput = z.input<
  typeof openLinearBallBushingModelPropsSchema
>
export type OpenLinearBallBushingModelProps = z.output<
  typeof openLinearBallBushingModelPropsSchema
>
export type OpenLinearBallBushingModelDefinition = z.output<
  typeof openLinearBallBushingModelDefinitionSchema
>
