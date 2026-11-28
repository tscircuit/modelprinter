import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { modelLengthSchema } from "../../model-length-schema"
import { validateGasketBoxProps } from "./validate"

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
  width: positive.default(120),
  depth: positive.default(80),
  height: positive.default(55),
  wallThickness: positive.default(3),
  cornerRadius: nonNegative.default(4),
  lidThickness: positive.default(3),
  grooveWidth: positive.default(3),
  grooveDepth: positive.default(2),
  lidScrews: z.literal(4).default(4),
  holePitchX: positive.default(104),
  holePitchY: positive.default(64),
  screwOnLid: z.literal(true).default(true),
}

export const gasketBoxModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateGasketBoxProps)

export const gasketBoxModelDefinitionSchema = z
  .object({ fn: z.literal("gasketbox"), ...shape })
  .strict()
  .superRefine(validateGasketBoxProps)

export type GasketBoxModelPropsInput = z.input<typeof gasketBoxModelPropsSchema>
export type GasketBoxModelProps = z.output<typeof gasketBoxModelPropsSchema>
export type GasketBoxModelDefinition = z.output<
  typeof gasketBoxModelDefinitionSchema
>
