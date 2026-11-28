import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateWireRopeClipProps } from "./validate"

const shape = {
  ropeDiameter: positive.default(6),
  uBoltDiameter: positive.default(6),
  threadDiameter: positive.default(6),
  legPitch: positive.default(18),
  legLength: positive.default(30),
  saddleWidth: positive.default(25),
  saddleLength: positive.default(15),
  saddleHeight: positive.default(8),
  grooveRadius: positive.default(3),
  hexNuts: z.literal(true).default(true),
  assembled: z.literal(true).default(true),
}

export const wireRopeClipModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateWireRopeClipProps)

export const wireRopeClipModelDefinitionSchema = z
  .object({ fn: z.literal("wireropeclip"), ...shape })
  .strict()
  .superRefine(validateWireRopeClipProps)

export type WireRopeClipModelPropsInput = z.input<
  typeof wireRopeClipModelPropsSchema
>
export type WireRopeClipModelProps = z.output<
  typeof wireRopeClipModelPropsSchema
>
export type WireRopeClipModelDefinition = z.output<
  typeof wireRopeClipModelDefinitionSchema
>
