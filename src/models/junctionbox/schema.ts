import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { modelLengthSchema } from "../../model-length-schema"
import { validateJunctionBoxProps } from "./validate"

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
  depth: positive.default(100),
  height: positive.default(60),
  wallThickness: positive.default(3),
  cornerRadius: nonNegative.default(3),
  frontKnockoutDiameter: positive.default(20),
  rightKnockoutDiameter: positive.default(20),
  rearKnockoutDiameter: positive.default(20),
  leftKnockoutDiameter: positive.default(20),
  screwOnLid: z.literal(true).default(true),
  lidScrews: z.literal(4).default(4),
  holePitchX: positive.default(84),
  holePitchY: positive.default(84),
}

export const junctionBoxModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateJunctionBoxProps)

export const junctionBoxModelDefinitionSchema = z
  .object({ fn: z.literal("junctionbox"), ...shape })
  .strict()
  .superRefine(validateJunctionBoxProps)

export type JunctionBoxModelPropsInput = z.input<
  typeof junctionBoxModelPropsSchema
>
export type JunctionBoxModelProps = z.output<typeof junctionBoxModelPropsSchema>
export type JunctionBoxModelDefinition = z.output<
  typeof junctionBoxModelDefinitionSchema
>
