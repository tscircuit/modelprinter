import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateHeaderSocketProps } from "./validate"

const shape = {
  pitch: positive.default(2.54),
  contacts: z.number().int().min(1).max(120).default(6),
  rows: z.number().int().min(1).max(4).default(2),
  width: positive.default(7.62),
  depth: positive.default(5.08),
  height: positive.default(8),
  tailLength: positive.default(3),
  pinThickness: positive.default(0.64),
  female: z.literal(true).default(true),
  throughHole: z.literal(true).default(true),
  vertical: z.literal(true).default(true),
}

export const headerSocketModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateHeaderSocketProps)

export const headerSocketModelDefinitionSchema = z
  .object({ fn: z.literal("headersocket"), ...shape })
  .strict()
  .superRefine(validateHeaderSocketProps)

export type HeaderSocketModelPropsInput = z.input<
  typeof headerSocketModelPropsSchema
>
export type HeaderSocketModelProps = z.output<
  typeof headerSocketModelPropsSchema
>
export type HeaderSocketModelDefinition = z.output<
  typeof headerSocketModelDefinitionSchema
>
