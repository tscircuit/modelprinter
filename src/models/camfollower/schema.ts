import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { normalizeCamFollowerProps } from "./normalize"
import { camFollowerMetricSizeSchema } from "./table"
import { validateCamFollowerProps } from "./validate"

const shape = {
  outerDiameter: positive.default(22),
  width: positive.default(12),
  studDiameter: positive.optional(),
  studLength: positive.default(20),
  needleBearing: z.literal(true).default(true),
  studMount: z.literal(true).default(true),
  metricSize: camFollowerMetricSizeSchema.default("M10"),
  threadPitch: positive.optional(),
  rightHanded: z.literal(true).default(true),
  threadClass: z.literal("6g").default("6g"),
  showThreads: z.boolean().default(true),
}

export const camFollowerModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateCamFollowerProps)
  .transform(normalizeCamFollowerProps)

export const camFollowerModelDefinitionSchema = z
  .object({ fn: z.literal("camfollower"), ...shape })
  .strict()
  .superRefine(validateCamFollowerProps)
  .transform(normalizeCamFollowerProps)

export type CamFollowerModelPropsInput = z.input<
  typeof camFollowerModelPropsSchema
>
export type CamFollowerModelProps = z.output<typeof camFollowerModelPropsSchema>
export type CamFollowerModelDefinition = z.output<
  typeof camFollowerModelDefinitionSchema
>
