import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateBallScrewNutProps } from "./validate"

const shape = {
  boreDiameter: positive.default(16),
  pitch: positive.default(5),
  outerDiameter: positive.default(28),
  length: positive.default(40),
  flangeOuterDiameter: positive.default(48),
  gothicArch: z.literal(true).default(true),
  handedness: z.enum(["right", "left"]).default("right"),
  externalTube: z.literal(true).default(true),
  face4Hole: z.literal(true).default(true),
  pcd: positive.default(38),
  holeDiameter: positive.default(5),
}

export const ballScrewNutModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateBallScrewNutProps)

export const ballScrewNutModelDefinitionSchema = z
  .object({ fn: z.literal("ballscrewnut"), ...shape })
  .strict()
  .superRefine(validateBallScrewNutProps)

export type BallScrewNutModelPropsInput = z.input<
  typeof ballScrewNutModelPropsSchema
>
export type BallScrewNutModelProps = z.output<
  typeof ballScrewNutModelPropsSchema
>
export type BallScrewNutModelDefinition = z.output<
  typeof ballScrewNutModelDefinitionSchema
>
