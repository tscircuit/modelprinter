import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateHydraulicSpinOnFilterProps } from "./validate"

const shape = {
  canOuterDiameter: positive.default(80),
  height: positive.default(140),
  portNominal: positive.default(12.7),
  headWidth: positive.default(100),
  headDepth: positive.default(40),
  canThreadDiameter: positive.default(20),
  canThreadPitch: positive.default(1.5),
  holes: z.number().int().min(2).max(4).default(2),
  holePitch: positive.default(50),
  holeDiameter: positive.default(6),
  headBolt: z.boolean().default(true),
}

export const hydraulicSpinOnFilterModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateHydraulicSpinOnFilterProps)

export const hydraulicSpinOnFilterModelDefinitionSchema = z
  .object({ fn: z.literal("hydraulicspinonfilter"), ...shape })
  .strict()
  .superRefine(validateHydraulicSpinOnFilterProps)

export type HydraulicSpinOnFilterModelPropsInput = z.input<
  typeof hydraulicSpinOnFilterModelPropsSchema
>
export type HydraulicSpinOnFilterModelProps = z.output<
  typeof hydraulicSpinOnFilterModelPropsSchema
>
export type HydraulicSpinOnFilterModelDefinition = z.output<
  typeof hydraulicSpinOnFilterModelDefinitionSchema
>
