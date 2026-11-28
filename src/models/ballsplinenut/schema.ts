import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateBallSplineNutProps } from "./validate"

const shape = {
  boreDiameter: positive.default(20),
  outerDiameter: positive.default(40),
  length: positive.default(60),
  flangeOuterDiameter: positive.default(60),
  raceCount: z.number().int().min(3).default(6),
  face4Hole: z.literal(true).default(true),
  pcd: positive.default(48),
  holeDiameter: positive.default(6),
  internalReturn: z.literal(true).default(true),
}

export const ballSplineNutModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateBallSplineNutProps)

export const ballSplineNutModelDefinitionSchema = z
  .object({ fn: z.literal("ballsplinenut"), ...shape })
  .strict()
  .superRefine(validateBallSplineNutProps)

export type BallSplineNutModelPropsInput = z.input<
  typeof ballSplineNutModelPropsSchema
>
export type BallSplineNutModelProps = z.output<
  typeof ballSplineNutModelPropsSchema
>
export type BallSplineNutModelDefinition = z.output<
  typeof ballSplineNutModelDefinitionSchema
>
