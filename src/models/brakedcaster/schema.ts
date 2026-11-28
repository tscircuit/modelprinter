import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateBrakedCasterProps } from "./validate"

const shape = {
  wheelDiameter: positive.default(75),
  wheelWidth: positive.default(25),
  plateWidth: positive.default(60),
  plateLength: positive.default(60),
  plate4Hole: z.literal(true).default(true),
  holeGridX: positive.default(45),
  holeGridY: positive.default(45),
  holeDiameter: positive.default(6),
  totalBrake: z.literal(true).default(true),
}

export const brakedCasterModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateBrakedCasterProps)

export const brakedCasterModelDefinitionSchema = z
  .object({ fn: z.literal("brakedcaster"), ...shape })
  .strict()
  .superRefine(validateBrakedCasterProps)

export type BrakedCasterModelPropsInput = z.input<
  typeof brakedCasterModelPropsSchema
>
export type BrakedCasterModelProps = z.output<
  typeof brakedCasterModelPropsSchema
>
export type BrakedCasterModelDefinition = z.output<
  typeof brakedCasterModelDefinitionSchema
>
