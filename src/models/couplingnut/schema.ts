import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { normalizeCouplingNutProps } from "./normalize"
import { couplingNutMetricSizeSchema } from "./table"
import { validateCouplingNutProps } from "./validate"

const shape = {
  din6334: z.literal(true).default(true),
  metricSize: couplingNutMetricSizeSchema,
  length: positive.optional(),
  acrossFlats: positive.optional(),
  threadPitch: positive.optional(),
  rightHanded: z.literal(true).default(true),
  threadClass: z.literal("6H").default("6H"),
  showThreads: z.boolean().default(true),
}

export const couplingNutModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateCouplingNutProps)
  .transform(normalizeCouplingNutProps)

export const couplingNutModelDefinitionSchema = z
  .object({ fn: z.literal("couplingnut"), ...shape })
  .strict()
  .superRefine(validateCouplingNutProps)
  .transform(normalizeCouplingNutProps)

export type CouplingNutModelPropsInput = z.input<
  typeof couplingNutModelPropsSchema
>
export type CouplingNutModelProps = z.output<typeof couplingNutModelPropsSchema>
export type CouplingNutModelDefinition = z.output<
  typeof couplingNutModelDefinitionSchema
>
