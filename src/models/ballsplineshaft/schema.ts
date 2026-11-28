import { z } from "zod"
import {
  nonnegativeGearLengthSchema as nonNegative,
  positiveGearLengthSchema as positive,
} from "../../gear-parameter-schemas"
import { validateBallSplineShaftProps } from "./validate"

const shape = {
  outerDiameter: positive.default(20),
  length: positive.default(250),
  grooves: z.number().int().min(3).default(6),
  roundBallRace: z.literal(true).default(true),
  raceCount: z.number().int().min(3).default(6),
  endChamfer: nonNegative.default(1),
}

export const ballSplineShaftModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateBallSplineShaftProps)

export const ballSplineShaftModelDefinitionSchema = z
  .object({ fn: z.literal("ballsplineshaft"), ...shape })
  .strict()
  .superRefine(validateBallSplineShaftProps)

export type BallSplineShaftModelPropsInput = z.input<
  typeof ballSplineShaftModelPropsSchema
>
export type BallSplineShaftModelProps = z.output<
  typeof ballSplineShaftModelPropsSchema
>
export type BallSplineShaftModelDefinition = z.output<
  typeof ballSplineShaftModelDefinitionSchema
>
