import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { normalizePlateNutProps } from "./normalize"
import { validatePlateNutProps } from "./validate"

const shape = {
  custom: z.literal(true).default(true),
  thread: z
    .string()
    .regex(/^m(?:\d+(?:\.\d+)?)$/i)
    .default("m4"),
  width: positive.default(12),
  length: positive.default(28),
  stripThickness: positive.default(0.8),
  holePitch: positive.default(20),
  rivetHoleDiameter: positive.default(3),
  nutOuterDiameter: positive.default(7),
  nutHeight: positive.default(4),
  flat: z.literal(true).default(true),
}

export const plateNutModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validatePlateNutProps)
  .transform(normalizePlateNutProps)

export const plateNutModelDefinitionSchema = z
  .object({ fn: z.literal("platenut"), ...shape })
  .strict()
  .superRefine(validatePlateNutProps)
  .transform(normalizePlateNutProps)

export type PlateNutModelPropsInput = z.input<typeof plateNutModelPropsSchema>
export type PlateNutModelProps = z.output<typeof plateNutModelPropsSchema>
export type PlateNutModelDefinition = z.output<
  typeof plateNutModelDefinitionSchema
>
