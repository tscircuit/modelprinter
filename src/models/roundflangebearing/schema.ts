import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateRoundFlangeBearingProps } from "./validate"

const shape = {
  boreDiameter: positive.default(20),
  outerDiameter: positive.default(90),
  depth: positive.default(35),
  pitchCircleDiameter: positive.default(70),
  face4Hole: z.literal(true).default(true),
  holeDiameter: positive.default(8),
}

export const roundFlangeBearingModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateRoundFlangeBearingProps)

export const roundFlangeBearingModelDefinitionSchema = z
  .object({ fn: z.literal("roundflangebearing"), ...shape })
  .strict()
  .superRefine(validateRoundFlangeBearingProps)

export type RoundFlangeBearingModelPropsInput = z.input<
  typeof roundFlangeBearingModelPropsSchema
>
export type RoundFlangeBearingModelProps = z.output<
  typeof roundFlangeBearingModelPropsSchema
>
export type RoundFlangeBearingModelDefinition = z.output<
  typeof roundFlangeBearingModelDefinitionSchema
>
