import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateTimingBeltProps } from "./validate"

const shape = {
  pitch: positive.default(5),
  teeth: z.number().int().min(10).default(100),
  width: positive.default(15),
  beltHeight: positive.default(3.6),
  htd5m: z.literal(true).default(true),
  pitchLength: positive.default(500),
  endless: z.literal(true).default(true),
}

export const timingBeltModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateTimingBeltProps)

export const timingBeltModelDefinitionSchema = z
  .object({ fn: z.literal("timingbelt"), ...shape })
  .strict()
  .superRefine(validateTimingBeltProps)

export type TimingBeltModelPropsInput = z.input<
  typeof timingBeltModelPropsSchema
>
export type TimingBeltModelProps = z.output<typeof timingBeltModelPropsSchema>
export type TimingBeltModelDefinition = z.output<
  typeof timingBeltModelDefinitionSchema
>
