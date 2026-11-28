import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { modelLengthSchema } from "../../model-length-schema"
import { validateSnapBoxProps } from "./validate"

const nonNegative = z
  .union([
    z.number(),
    z
      .string()
      .regex(/^(?:\d+(?:\.\d*)?|\.\d+)(?:mm|cm|m|in|inch|mil|ft|feet)?$/i),
  ])
  .pipe(modelLengthSchema)
  .refine((value) => value >= 0, "Length cannot be negative")

const shape = {
  width: positive.default(80),
  depth: positive.default(50),
  height: positive.default(25),
  wallThickness: positive.default(2),
  cornerRadius: nonNegative.default(2),
  lidThickness: positive.default(2),
  hooks: z.literal(4).default(4),
  hookWidth: positive.default(8),
  hookDepth: positive.default(1),
  recessLap: positive.default(2),
  snapLid: z.literal(true).default(true),
}

export const snapBoxModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateSnapBoxProps)

export const snapBoxModelDefinitionSchema = z
  .object({ fn: z.literal("snapbox"), ...shape })
  .strict()
  .superRefine(validateSnapBoxProps)

export type SnapBoxModelPropsInput = z.input<typeof snapBoxModelPropsSchema>
export type SnapBoxModelProps = z.output<typeof snapBoxModelPropsSchema>
export type SnapBoxModelDefinition = z.output<
  typeof snapBoxModelDefinitionSchema
>
