import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateGearRackProps } from "./validate"

const shape = {
  module: positive.default(2),
  length: positive.default(200),
  width: positive.default(15),
  height: positive.default(15),
  pressureAngle: z.literal(20).default(20),
  base2Hole: z.literal(true).default(true),
  holeDiameter: positive.default(5),
  holePitch: positive.default(160),
}

export const gearRackModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateGearRackProps)

export const gearRackModelDefinitionSchema = z
  .object({ fn: z.literal("gearrack"), ...shape })
  .strict()
  .superRefine(validateGearRackProps)

export type GearRackModelPropsInput = z.input<typeof gearRackModelPropsSchema>
export type GearRackModelProps = z.output<typeof gearRackModelPropsSchema>
export type GearRackModelDefinition = z.output<
  typeof gearRackModelDefinitionSchema
>
