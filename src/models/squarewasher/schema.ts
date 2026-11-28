import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateSquareWasherProps } from "./validate"

const shape = {
  custom: z.literal(true).default(true),
  innerDiameter: positive.default(8.4),
  width: positive.default(25),
  length: positive.default(25),
  height: positive.default(3),
  centeredHole: z.literal(true).default(true),
  squareCorners: z.literal(true).default(true),
}

export const squareWasherModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateSquareWasherProps)

export const squareWasherModelDefinitionSchema = z
  .object({ fn: z.literal("squarewasher"), ...shape })
  .strict()
  .superRefine(validateSquareWasherProps)

export type SquareWasherModelPropsInput = z.input<
  typeof squareWasherModelPropsSchema
>
export type SquareWasherModelProps = z.output<
  typeof squareWasherModelPropsSchema
>
export type SquareWasherModelDefinition = z.output<
  typeof squareWasherModelDefinitionSchema
>
