import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateBallScrewProps } from "./validate"

const shape = {
  diameter: positive.default(16),
  length: positive.default(400),
  pitch: positive.default(5),
  gothicArch: z.literal(true).default(true),
  handedness: z.enum(["right", "left"]).default("right"),
  starts: z.number().int().min(1).default(1),
  endJournalDiameter: positive.default(12),
  endJournalLength: positive.default(30),
}

export const ballScrewModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateBallScrewProps)

export const ballScrewModelDefinitionSchema = z
  .object({ fn: z.literal("ballscrew"), ...shape })
  .strict()
  .superRefine(validateBallScrewProps)

export type BallScrewModelPropsInput = z.input<typeof ballScrewModelPropsSchema>
export type BallScrewModelProps = z.output<typeof ballScrewModelPropsSchema>
export type BallScrewModelDefinition = z.output<
  typeof ballScrewModelDefinitionSchema
>
