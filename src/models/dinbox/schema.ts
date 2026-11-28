import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateDinBoxProps } from "./validate"

const shape = {
  width: positive.default(45),
  depth: positive.default(90),
  height: positive.default(75),
  wallThickness: positive.default(2),
  th35x75: z.literal(true).default(true),
  rearLowerClip: z.literal(true).default(true),
  topBottomTerminals: z.literal(true).default(true),
  screwOnLid: z.literal(true).default(true),
}

export const dinBoxModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateDinBoxProps)

export const dinBoxModelDefinitionSchema = z
  .object({ fn: z.literal("dinbox"), ...shape })
  .strict()
  .superRefine(validateDinBoxProps)

export type DinBoxModelPropsInput = z.input<typeof dinBoxModelPropsSchema>
export type DinBoxModelProps = z.output<typeof dinBoxModelPropsSchema>
export type DinBoxModelDefinition = z.output<typeof dinBoxModelDefinitionSchema>
