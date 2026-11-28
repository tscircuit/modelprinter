import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateAxialFanProps } from "./validate"

const shape = {
  width: positive.default(40),
  height: positive.default(40),
  depth: positive.default(10),
  holeDiameter: positive.default(3.5),
  holePitchX: positive.default(32),
  holePitchY: positive.default(32),
  hubOuterDiameter: positive.default(16),
  blades: z.number().int().min(3).max(15).default(7),
  cwFront: z.literal(true).default(true),
  frontToRear: z.literal(true).default(true),
  bladePitchAngle: z.number().finite().gt(0).lt(75).default(25),
  flatPitched: z.literal(true).default(true),
}

export const axialFanModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateAxialFanProps)

export const axialFanModelDefinitionSchema = z
  .object({ fn: z.literal("axialfan"), ...shape })
  .strict()
  .superRefine(validateAxialFanProps)

export type AxialFanModelPropsInput = z.input<typeof axialFanModelPropsSchema>
export type AxialFanModelProps = z.output<typeof axialFanModelPropsSchema>
export type AxialFanModelDefinition = z.output<
  typeof axialFanModelDefinitionSchema
>
