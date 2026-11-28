import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateFixedCasterProps } from "./validate"

const shape = {
  wheelDiameter: positive.default(50),
  wheelWidth: positive.default(20),
  plateWidth: positive.default(50),
  plateHeight: positive.default(50),
  plate4Hole: z.literal(true).default(true),
  holeGrid: z.tuple([positive, positive]).default([35, 35]),
  holeDiameter: positive.default(6),
}

export const fixedCasterModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateFixedCasterProps)

export const fixedCasterModelDefinitionSchema = z
  .object({ fn: z.literal("fixedcaster"), ...shape })
  .strict()
  .superRefine(validateFixedCasterProps)

export type FixedCasterModelPropsInput = z.input<
  typeof fixedCasterModelPropsSchema
>
export type FixedCasterModelProps = z.output<typeof fixedCasterModelPropsSchema>
export type FixedCasterModelDefinition = z.output<
  typeof fixedCasterModelDefinitionSchema
>
