import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateMagneticBaseProps } from "./validate"

const shape = {
  baseLength: positive.default(50),
  baseWidth: positive.default(50),
  baseHeight: positive.default(60),
  armLength: positive.default(150),
  armDiameter: positive.default(10),
  jointDiameter: positive.default(20),
  clampBoreDiameter: positive.default(8),
}

export const magneticBaseModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateMagneticBaseProps)

export const magneticBaseModelDefinitionSchema = z
  .object({ fn: z.literal("magneticbase"), ...shape })
  .strict()
  .superRefine(validateMagneticBaseProps)

export type MagneticBaseModelPropsInput = z.input<
  typeof magneticBaseModelPropsSchema
>
export type MagneticBaseModelProps = z.output<
  typeof magneticBaseModelPropsSchema
>
export type MagneticBaseModelDefinition = z.output<
  typeof magneticBaseModelDefinitionSchema
>
