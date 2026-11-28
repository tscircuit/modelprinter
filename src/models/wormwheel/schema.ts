import { z } from "zod"
import {
  gearPressureAngleSchema,
  positiveGearLengthSchema as positive,
} from "../../gear-parameter-schemas"
import { validateWormWheelProps } from "./validate"

const shape = {
  teeth: z.number().int().min(10).default(30),
  axialModule: positive.default(2),
  boreDiameter: positive.default(10),
  width: positive.default(15),
  axialPressureAngle: gearPressureAngleSchema.default(20),
  rightHand: z.boolean().default(true),
  starts: z.number().int().min(1).default(1),
  wormPitchDiameter: positive.default(20),
  keyway: z.literal(true).default(true),
  keyWidth: positive.default(3),
}

export const wormWheelModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateWormWheelProps)

export const wormWheelModelDefinitionSchema = z
  .object({ fn: z.literal("wormwheel"), ...shape })
  .strict()
  .superRefine(validateWormWheelProps)

export type WormWheelModelPropsInput = z.input<typeof wormWheelModelPropsSchema>
export type WormWheelModelProps = z.output<typeof wormWheelModelPropsSchema>
export type WormWheelModelDefinition = z.output<
  typeof wormWheelModelDefinitionSchema
>
