import { z } from "zod"
import {
  nonnegativeGearLengthSchema as nonnegative,
  positiveGearLengthSchema as positive,
} from "../../gear-parameter-schemas"
import { validateSplinedShaftProps } from "./validate"

const shape = {
  outerDiameter: positive.default(20),
  rootDiameter: positive.default(16),
  length: positive.default(200),
  teeth: z.number().int().min(4).max(24).default(6),
  toothWidth: positive.default(4),
  endChamfer: nonnegative.default(1),
  straightSided: z.literal(true).default(true),
}

export const splinedShaftModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateSplinedShaftProps)

export const splinedShaftModelDefinitionSchema = z
  .object({ fn: z.literal("splinedshaft"), ...shape })
  .strict()
  .superRefine(validateSplinedShaftProps)

export type SplinedShaftModelPropsInput = z.input<
  typeof splinedShaftModelPropsSchema
>
export type SplinedShaftModelProps = z.output<
  typeof splinedShaftModelPropsSchema
>
export type SplinedShaftModelDefinition = z.output<
  typeof splinedShaftModelDefinitionSchema
>
