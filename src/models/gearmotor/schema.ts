import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { modelLengthSchema } from "../../model-length-schema"
import { normalizeGearMotorProps } from "./normalize"
import { validateGearMotorProps } from "./validate"

const nonNegative = z
  .union([
    z.number(),
    z
      .string()
      .regex(/^(?:\d+(?:\.\d*)?|\.\d+)(?:mm|cm|m|in|inch|mil|ft|feet)?$/i),
  ])
  .pipe(modelLengthSchema)
  .refine((value) => value >= 0, "Length cannot be negative")

const shape = {
  bodyOuterDiameter: positive.default(37),
  bodyLength: positive.default(70),
  shaftDiameter: positive.default(6),
  shaftLength: positive.default(18),
  shaftOffset: nonNegative.default(8),
  face4Hole: z.literal(true).default(true),
  pitchCircleDiameter: positive.default(28),
  thread: z
    .string()
    .regex(/^m(?:\d+(?:\.\d+)?)$/i)
    .default("m3"),
  offsetSpur: z.literal(true).default(true),
}

export const gearMotorModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateGearMotorProps)
  .transform(normalizeGearMotorProps)

export const gearMotorModelDefinitionSchema = z
  .object({ fn: z.literal("gearmotor"), ...shape })
  .strict()
  .superRefine(validateGearMotorProps)
  .transform(normalizeGearMotorProps)

export type GearMotorModelPropsInput = z.input<typeof gearMotorModelPropsSchema>
export type GearMotorModelProps = z.output<typeof gearMotorModelPropsSchema>
export type GearMotorModelDefinition = z.output<
  typeof gearMotorModelDefinitionSchema
>
