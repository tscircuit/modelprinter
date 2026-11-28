import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { normalizeWingNutProps } from "./normalize"
import { wingNutMetricSizeSchema } from "./table"
import { validateWingNutProps } from "./validate"

const shape = {
  din315: z.literal(true).default(true),
  metricSize: wingNutMetricSizeSchema,
  roundedWings: z.literal(true).default(true),
  threadPitch: positive.optional(),
  rightHanded: z.literal(true).default(true),
  threadClass: z.literal("6H").default("6H"),
  showThreads: z.boolean().default(true),
}

export const wingNutModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateWingNutProps)
  .transform(normalizeWingNutProps)

export const wingNutModelDefinitionSchema = z
  .object({ fn: z.literal("wingnut"), ...shape })
  .strict()
  .superRefine(validateWingNutProps)
  .transform(normalizeWingNutProps)

export type WingNutModelPropsInput = z.input<typeof wingNutModelPropsSchema>
export type WingNutModelProps = z.output<typeof wingNutModelPropsSchema>
export type WingNutModelDefinition = z.output<
  typeof wingNutModelDefinitionSchema
>
