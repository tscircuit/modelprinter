import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateMecanumWheelProps } from "./validate"

const shape = {
  outerDiameter: positive.default(100),
  width: positive.default(50),
  boreDiameter: positive.default(10),
  rollers: z.number().int().min(6).default(8),
  rollerAngleDeg: z.number().finite().default(45),
  keyway: z.literal(true).default(true),
  keyWidth: positive.default(3),
  handedness: z.enum(["right", "left"]).default("right"),
}

export const mecanumWheelModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateMecanumWheelProps)

export const mecanumWheelModelDefinitionSchema = z
  .object({ fn: z.literal("mecanumwheel"), ...shape })
  .strict()
  .superRefine(validateMecanumWheelProps)

export type MecanumWheelModelPropsInput = z.input<
  typeof mecanumWheelModelPropsSchema
>
export type MecanumWheelModelProps = z.output<
  typeof mecanumWheelModelPropsSchema
>
export type MecanumWheelModelDefinition = z.output<
  typeof mecanumWheelModelDefinitionSchema
>
