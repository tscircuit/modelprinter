import { z } from "zod"
import {
  nonnegativeGearLengthSchema as nonnegative,
  positiveGearLengthSchema as positive,
} from "../../gear-parameter-schemas"
import { validateFlushPullProps } from "./validate"

const shape = {
  width: positive.default(80),
  height: positive.default(35),
  depth: positive.default(15),
  wallThickness: positive.default(2),
  flangeWidth: positive.default(4),
  cornerRadius: nonnegative.default(3),
  holes: z.literal(2).default(2),
  holeDiameter: positive.default(3),
  holePitch: positive.default(72),
}

export const flushPullModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateFlushPullProps)

export const flushPullModelDefinitionSchema = z
  .object({ fn: z.literal("flushpull"), ...shape })
  .strict()
  .superRefine(validateFlushPullProps)

export type FlushPullModelPropsInput = z.input<typeof flushPullModelPropsSchema>
export type FlushPullModelProps = z.output<typeof flushPullModelPropsSchema>
export type FlushPullModelDefinition = z.output<
  typeof flushPullModelDefinitionSchema
>
