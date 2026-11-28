import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateWaveSpringWasherProps } from "./validate"

const shape = {
  innerDiameter: positive.default(6),
  outerDiameter: positive.default(12),
  stripThickness: positive.default(0.5),
  freeHeight: positive.default(1.5),
  waves: z.number().int().min(2).max(8).default(3),
  sinusoidal: z.literal(true).default(true),
  freeState: z.literal(true).default(true),
}

export const waveSpringWasherModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateWaveSpringWasherProps)

export const waveSpringWasherModelDefinitionSchema = z
  .object({ fn: z.literal("wavespringwasher"), ...shape })
  .strict()
  .superRefine(validateWaveSpringWasherProps)

export type WaveSpringWasherModelPropsInput = z.input<
  typeof waveSpringWasherModelPropsSchema
>
export type WaveSpringWasherModelProps = z.output<
  typeof waveSpringWasherModelPropsSchema
>
export type WaveSpringWasherModelDefinition = z.output<
  typeof waveSpringWasherModelDefinitionSchema
>
