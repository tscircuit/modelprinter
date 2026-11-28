import { z } from "zod"
import {
  nonnegativeGearLengthSchema as nonNegative,
  positiveGearLengthSchema as positive,
} from "../../gear-parameter-schemas"
import { validateSquareSectionSealProps } from "./validate"

const shape = {
  innerDiameter: positive.default(20),
  sectionWidth: positive.default(2),
  squareProfile: z.literal(true).default(true),
  cornerRadius: nonNegative.default(0.2),
}

export const squareSectionSealModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateSquareSectionSealProps)

export const squareSectionSealModelDefinitionSchema = z
  .object({ fn: z.literal("squaresectionseal"), ...shape })
  .strict()
  .superRefine(validateSquareSectionSealProps)

export type SquareSectionSealModelPropsInput = z.input<
  typeof squareSectionSealModelPropsSchema
>
export type SquareSectionSealModelProps = z.output<
  typeof squareSectionSealModelPropsSchema
>
export type SquareSectionSealModelDefinition = z.output<
  typeof squareSectionSealModelDefinitionSchema
>
