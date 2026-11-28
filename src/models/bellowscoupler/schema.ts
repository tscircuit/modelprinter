import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateBellowsCouplerProps } from "./validate"

const shape = {
  boreDiameter: positive.default(8),
  outerDiameter: positive.default(25),
  length: positive.default(40),
  folds: z.number().int().min(2).max(12).default(6),
  bellowsWallThickness: positive.default(0.2),
  splitClamp: z.literal(true).default(true),
}

export const bellowsCouplerModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateBellowsCouplerProps)

export const bellowsCouplerModelDefinitionSchema = z
  .object({ fn: z.literal("bellowscoupler"), ...shape })
  .strict()
  .superRefine(validateBellowsCouplerProps)

export type BellowsCouplerModelPropsInput = z.input<
  typeof bellowsCouplerModelPropsSchema
>
export type BellowsCouplerModelProps = z.output<
  typeof bellowsCouplerModelPropsSchema
>
export type BellowsCouplerModelDefinition = z.output<
  typeof bellowsCouplerModelDefinitionSchema
>
