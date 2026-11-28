import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateVBeltProps } from "./validate"

const shape = {
  length: positive.default(500),
  topWidth: positive.default(10),
  height: positive.default(6),
  customV: z.literal(true).default(true),
  sideAngle: z.number().finite().gt(10).lt(90).default(40),
  endless: z.literal(true).default(true),
}

export const vBeltModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateVBeltProps)

export const vBeltModelDefinitionSchema = z
  .object({ fn: z.literal("vbelt"), ...shape })
  .strict()
  .superRefine(validateVBeltProps)

export type VBeltModelPropsInput = z.input<typeof vBeltModelPropsSchema>
export type VBeltModelProps = z.output<typeof vBeltModelPropsSchema>
export type VBeltModelDefinition = z.output<typeof vBeltModelDefinitionSchema>
