import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateRodWiperSealProps } from "./validate"

const shape = {
  rodOuterDiameter: positive.default(12),
  outerDiameter: positive.default(20),
  height: positive.default(5),
  singleLip: z.literal(true).default(true),
  inwardLip: z.literal(true).default(true),
  bodyInnerDiameter: positive.default(13),
  lipThickness: positive.default(1),
  baseThickness: positive.default(3),
}

export const rodWiperSealModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateRodWiperSealProps)

export const rodWiperSealModelDefinitionSchema = z
  .object({ fn: z.literal("rodwiperseal"), ...shape })
  .strict()
  .superRefine(validateRodWiperSealProps)

export type RodWiperSealModelPropsInput = z.input<
  typeof rodWiperSealModelPropsSchema
>
export type RodWiperSealModelProps = z.output<
  typeof rodWiperSealModelPropsSchema
>
export type RodWiperSealModelDefinition = z.output<
  typeof rodWiperSealModelDefinitionSchema
>
