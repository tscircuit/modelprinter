import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateFlangeBearingProps } from "./validate"

const shape = {
  boreDiameter: positive.default(20),
  width: positive.default(86),
  height: positive.default(86),
  depth: positive.default(35),
  face4Hole: z.literal(true).default(true),
  holeGridX: positive.default(64),
  holeGridY: positive.default(64),
  holeDiameter: positive.default(10),
}

export const flangeBearingModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateFlangeBearingProps)

export const flangeBearingModelDefinitionSchema = z
  .object({ fn: z.literal("flangebearing"), ...shape })
  .strict()
  .superRefine(validateFlangeBearingProps)

export type FlangeBearingModelPropsInput = z.input<
  typeof flangeBearingModelPropsSchema
>
export type FlangeBearingModelProps = z.output<
  typeof flangeBearingModelPropsSchema
>
export type FlangeBearingModelDefinition = z.output<
  typeof flangeBearingModelDefinitionSchema
>
