import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { metricBoltSizeSchema } from "../../hex-socket-bolt-schema"
import { normalizeJawCouplerProps } from "./normalize"
import { validateJawCouplerProps } from "./validate"

const shape = {
  boreDiameter: positive.default(8),
  boreBDiameter: positive.optional(),
  outerDiameter: positive.default(30),
  length: positive.default(40),
  jawCount: z.number().int().min(2).max(12).default(3),
  curvedJaw: z.literal(true).default(true),
  setScrew: z.literal(true).default(true),
  metricSize: metricBoltSizeSchema.default("M4"),
  threadPitch: positive.optional(),
  rightHanded: z.literal(true).default(true),
  threadClass: z.literal("6H").default("6H"),
  showThreads: z.boolean().default(true),
}

export const jawCouplerModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateJawCouplerProps)
  .transform(normalizeJawCouplerProps)

export const jawCouplerModelDefinitionSchema = z
  .object({ fn: z.literal("jawcoupler"), ...shape })
  .strict()
  .superRefine(validateJawCouplerProps)
  .transform(normalizeJawCouplerProps)

export type JawCouplerModelPropsInput = z.input<
  typeof jawCouplerModelPropsSchema
>
export type JawCouplerModelProps = z.output<typeof jawCouplerModelPropsSchema>
export type JawCouplerModelDefinition = z.output<
  typeof jawCouplerModelDefinitionSchema
>
