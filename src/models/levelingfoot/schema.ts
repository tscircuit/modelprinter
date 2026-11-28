import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { normalizeLevelingFootProps } from "./normalize"
import { levelingFootMetricSizeSchema } from "./table"
import { validateLevelingFootProps } from "./validate"

const shape = {
  padDiameter: positive.default(30),
  padHeight: positive.default(8),
  metricSize: levelingFootMetricSizeSchema.default("M8"),
  stemLength: positive.default(27),
  swivelAngle: z.literal(0).default(0),
  flatBase: z.literal(true).default(true),
  threadPitch: positive.optional(),
  rightHanded: z.literal(true).default(true),
  threadClass: z.literal("6g").default("6g"),
  showThreads: z.boolean().default(true),
}

export const levelingFootModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateLevelingFootProps)
  .transform(normalizeLevelingFootProps)

export const levelingFootModelDefinitionSchema = z
  .object({ fn: z.literal("levelingfoot"), ...shape })
  .strict()
  .superRefine(validateLevelingFootProps)
  .transform(normalizeLevelingFootProps)

export type LevelingFootModelPropsInput = z.input<
  typeof levelingFootModelPropsSchema
>
export type LevelingFootModelProps = z.output<
  typeof levelingFootModelPropsSchema
>
export type LevelingFootModelDefinition = z.output<
  typeof levelingFootModelDefinitionSchema
>
