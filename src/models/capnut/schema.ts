import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { normalizeCapNutProps } from "./normalize"
import { capNutMetricSizeSchema } from "./table"
import { validateCapNutProps } from "./validate"

const shape = {
  din1587: z.literal(true).default(true),
  metricSize: capNutMetricSizeSchema,
  threadPitch: positive.optional(),
  rightHanded: z.literal(true).default(true),
  threadClass: z.literal("6H").default("6H"),
  showThreads: z.boolean().default(true),
}

export const capNutModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateCapNutProps)
  .transform(normalizeCapNutProps)

export const capNutModelDefinitionSchema = z
  .object({ fn: z.literal("capnut"), ...shape })
  .strict()
  .superRefine(validateCapNutProps)
  .transform(normalizeCapNutProps)

export type CapNutModelPropsInput = z.input<typeof capNutModelPropsSchema>
export type CapNutModelProps = z.output<typeof capNutModelPropsSchema>
export type CapNutModelDefinition = z.output<typeof capNutModelDefinitionSchema>
