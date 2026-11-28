import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateCurrentTransformerProps } from "./validate"

const shape = {
  width: positive.default(40),
  height: positive.default(45),
  depth: positive.default(20),
  boreDiameter: positive.default(20),
  terminals: z.literal(2).default(2),
  tabs: z.literal(2).default(2),
  holeDiameter: positive.default(4),
  holePitch: positive.default(50),
  closedRing: z.literal(true).default(true),
}

export const currentTransformerModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateCurrentTransformerProps)

export const currentTransformerModelDefinitionSchema = z
  .object({ fn: z.literal("currenttransformer"), ...shape })
  .strict()
  .superRefine(validateCurrentTransformerProps)

export type CurrentTransformerModelPropsInput = z.input<
  typeof currentTransformerModelPropsSchema
>
export type CurrentTransformerModelProps = z.output<
  typeof currentTransformerModelPropsSchema
>
export type CurrentTransformerModelDefinition = z.output<
  typeof currentTransformerModelDefinitionSchema
>
