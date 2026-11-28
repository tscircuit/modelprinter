import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { normalizeBallStudProps } from "./normalize"
import { validateBallStudProps } from "./validate"

const shape = {
  custom: z.literal(true).default(true),
  thread: z
    .string()
    .regex(/^m(?:\d+(?:\.\d+)?)$/i)
    .default("m6"),
  threadLength: positive.default(15),
  ballDiameter: positive.default(10),
  neckDiameter: positive.default(5),
  neckLength: positive.default(4),
  shoulderAcrossFlats: positive.default(10),
  shoulderHeight: positive.default(3),
  fullThread: z.literal(true).default(true),
}

export const ballStudModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateBallStudProps)
  .transform(normalizeBallStudProps)

export const ballStudModelDefinitionSchema = z
  .object({ fn: z.literal("ballstud"), ...shape })
  .strict()
  .superRefine(validateBallStudProps)
  .transform(normalizeBallStudProps)

export type BallStudModelPropsInput = z.input<typeof ballStudModelPropsSchema>
export type BallStudModelProps = z.output<typeof ballStudModelPropsSchema>
export type BallStudModelDefinition = z.output<
  typeof ballStudModelDefinitionSchema
>
