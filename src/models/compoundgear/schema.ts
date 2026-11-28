import { z } from "zod"
import {
  gearPressureAngleSchema,
  positiveGearLengthSchema as positive,
} from "../../gear-parameter-schemas"
import { validateCompoundGearProps } from "./validate"

const shape = {
  teethA: z.number().int().min(8).default(16),
  teethB: z.number().int().min(12).default(40),
  module: positive.default(1),
  width: positive.default(16),
  boreDiameter: positive.default(8),
  pressureAngleDeg: gearPressureAngleSchema.default(20),
  keyway: z.literal(true).default(true),
  keyWidth: positive.default(3),
}

export const compoundGearModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateCompoundGearProps)

export const compoundGearModelDefinitionSchema = z
  .object({ fn: z.literal("compoundgear"), ...shape })
  .strict()
  .superRefine(validateCompoundGearProps)

export type CompoundGearModelPropsInput = z.input<
  typeof compoundGearModelPropsSchema
>
export type CompoundGearModelProps = z.output<
  typeof compoundGearModelPropsSchema
>
export type CompoundGearModelDefinition = z.output<
  typeof compoundGearModelDefinitionSchema
>
