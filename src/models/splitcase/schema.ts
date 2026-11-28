import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { modelLengthSchema } from "../../model-length-schema"
import { validateSplitCaseProps } from "./validate"

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
  width: positive.default(100),
  depth: positive.default(60),
  height: positive.default(28),
  wallThickness: positive.default(2),
  cornerRadius: nonNegative.default(3),
  splitHeight: positive.default(14),
  seamLap: positive.default(2),
  screwOnLid: z.literal(true).default(true),
  screws: z.literal(4).default(4),
  screwHoleDiameter: positive.default(3),
  holePitchX: positive.default(86),
  holePitchY: positive.default(46),
}

export const splitCaseModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateSplitCaseProps)

export const splitCaseModelDefinitionSchema = z
  .object({ fn: z.literal("splitcase"), ...shape })
  .strict()
  .superRefine(validateSplitCaseProps)

export type SplitCaseModelPropsInput = z.input<typeof splitCaseModelPropsSchema>
export type SplitCaseModelProps = z.output<typeof splitCaseModelPropsSchema>
export type SplitCaseModelDefinition = z.output<
  typeof splitCaseModelDefinitionSchema
>
