import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateFlangedLinearBushingProps } from "./validate"

const shape = {
  innerDiameter: positive.default(12),
  outerDiameter: positive.default(21),
  length: positive.default(30),
  flangeOuterDiameter: positive.default(42),
  closedRecirculating: z.literal(true).default(true),
  round4Hole: z.literal(true).default(true),
  pitchCircleDiameter: positive.default(32),
  holeDiameter: positive.default(4),
}

export const flangedLinearBushingModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateFlangedLinearBushingProps)

export const flangedLinearBushingModelDefinitionSchema = z
  .object({ fn: z.literal("flangedlinearbushing"), ...shape })
  .strict()
  .superRefine(validateFlangedLinearBushingProps)

export type FlangedLinearBushingModelPropsInput = z.input<
  typeof flangedLinearBushingModelPropsSchema
>
export type FlangedLinearBushingModelProps = z.output<
  typeof flangedLinearBushingModelPropsSchema
>
export type FlangedLinearBushingModelDefinition = z.output<
  typeof flangedLinearBushingModelDefinitionSchema
>
