import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateHeatSpreaderProps } from "./validate"

const shape = {
  width: positive.default(50),
  length: positive.default(50),
  thickness: positive.default(3),
  bossWidth: positive.default(20),
  bossLength: positive.default(20),
  bossHeight: positive.default(2),
  holes: z.literal(4).default(4),
  holeDiameter: positive.default(3),
  countersinkDiameter: positive.default(6),
  holePitchX: positive.default(40),
  holePitchY: positive.default(40),
}

export const heatSpreaderModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateHeatSpreaderProps)

export const heatSpreaderModelDefinitionSchema = z
  .object({ fn: z.literal("heatspreader"), ...shape })
  .strict()
  .superRefine(validateHeatSpreaderProps)

export type HeatSpreaderModelPropsInput = z.input<
  typeof heatSpreaderModelPropsSchema
>
export type HeatSpreaderModelProps = z.output<
  typeof heatSpreaderModelPropsSchema
>
export type HeatSpreaderModelDefinition = z.output<
  typeof heatSpreaderModelDefinitionSchema
>
