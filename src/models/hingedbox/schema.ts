import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { modelLengthSchema } from "../../model-length-schema"
import { validateHingedBoxProps } from "./validate"

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
  width: positive.default(150),
  depth: positive.default(100),
  height: positive.default(70),
  wallThickness: positive.default(3),
  cornerRadius: nonNegative.default(4),
  lidThickness: positive.default(3),
  leftHinge: z.literal(true).default(true),
  hingePinDiameter: positive.default(4),
  knuckles: z.number().int().min(3).max(15).default(5),
  rightLatch: z.literal(true).default(true),
}

export const hingedBoxModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateHingedBoxProps)

export const hingedBoxModelDefinitionSchema = z
  .object({ fn: z.literal("hingedbox"), ...shape })
  .strict()
  .superRefine(validateHingedBoxProps)

export type HingedBoxModelPropsInput = z.input<typeof hingedBoxModelPropsSchema>
export type HingedBoxModelProps = z.output<typeof hingedBoxModelPropsSchema>
export type HingedBoxModelDefinition = z.output<
  typeof hingedBoxModelDefinitionSchema
>
