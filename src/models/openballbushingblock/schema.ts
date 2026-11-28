import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { normalizeOpenBallBushingBlockProps } from "./normalize"
import { validateOpenBallBushingBlockProps } from "./validate"

const shape = {
  boreDiameter: positive.default(16),
  length: positive.default(50),
  width: positive.default(44),
  height: positive.default(33),
  openRecirculating: z.literal(true).default(true),
  top4Hole: z.literal(true).default(true),
  holeGridX: positive.default(30),
  holeGridY: positive.default(36),
  thread: z
    .string()
    .regex(/^m(?:\d+(?:\.\d+)?)$/i)
    .default("m5"),
}

export const openBallBushingBlockModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateOpenBallBushingBlockProps)
  .transform(normalizeOpenBallBushingBlockProps)

export const openBallBushingBlockModelDefinitionSchema = z
  .object({ fn: z.literal("openballbushingblock"), ...shape })
  .strict()
  .superRefine(validateOpenBallBushingBlockProps)
  .transform(normalizeOpenBallBushingBlockProps)

export type OpenBallBushingBlockModelPropsInput = z.input<
  typeof openBallBushingBlockModelPropsSchema
>
export type OpenBallBushingBlockModelProps = z.output<
  typeof openBallBushingBlockModelPropsSchema
>
export type OpenBallBushingBlockModelDefinition = z.output<
  typeof openBallBushingBlockModelDefinitionSchema
>
