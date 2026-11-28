import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateLeafSpringProps } from "./validate"

const shape = {
  custom: z.literal(true).default(true),
  width: positive.default(15),
  arcLength: positive.default(80),
  thickness: positive.default(1),
  radius: positive.default(100),
  circularArc: z.literal(true).default(true),
  squareEnds: z.literal(true).default(true),
  freeState: z.literal(true).default(true),
}

export const leafSpringModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateLeafSpringProps)

export const leafSpringModelDefinitionSchema = z
  .object({ fn: z.literal("leafspring"), ...shape })
  .strict()
  .superRefine(validateLeafSpringProps)

export type LeafSpringModelPropsInput = z.input<
  typeof leafSpringModelPropsSchema
>
export type LeafSpringModelProps = z.output<typeof leafSpringModelPropsSchema>
export type LeafSpringModelDefinition = z.output<
  typeof leafSpringModelDefinitionSchema
>
