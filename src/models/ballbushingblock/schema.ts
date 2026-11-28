import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { normalizeBallBushingBlockProps } from "./normalize"
import { validateBallBushingBlockProps } from "./validate"

const shape = {
  boreDiameter: positive.default(8),
  length: positive.default(30),
  width: positive.default(34),
  height: positive.default(22),
  closedRecirculating: z.literal(true).default(true),
  top4Hole: z.literal(true).default(true),
  holeGridX: positive.default(18),
  holeGridY: positive.default(24),
  thread: z
    .string()
    .regex(/^m(?:\d+(?:\.\d+)?)$/i)
    .default("m4"),
}

export const ballBushingBlockModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateBallBushingBlockProps)
  .transform(normalizeBallBushingBlockProps)

export const ballBushingBlockModelDefinitionSchema = z
  .object({ fn: z.literal("ballbushingblock"), ...shape })
  .strict()
  .superRefine(validateBallBushingBlockProps)
  .transform(normalizeBallBushingBlockProps)

export type BallBushingBlockModelPropsInput = z.input<
  typeof ballBushingBlockModelPropsSchema
>
export type BallBushingBlockModelProps = z.output<
  typeof ballBushingBlockModelPropsSchema
>
export type BallBushingBlockModelDefinition = z.output<
  typeof ballBushingBlockModelDefinitionSchema
>
