import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateFixtureJackProps } from "./validate"

const shape = {
  baseDiameter: positive.default(30),
  baseHeight: positive.default(10),
  height: positive.default(50),
  travel: positive.default(20),
  stemDiameter: positive.default(12),
  threadDiameter: positive.default(8),
  threadLength: positive.default(10),
  padDiameter: positive.default(20),
  padThickness: positive.default(5),
}

export const fixtureJackModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateFixtureJackProps)

export const fixtureJackModelDefinitionSchema = z
  .object({ fn: z.literal("fixturejack"), ...shape })
  .strict()
  .superRefine(validateFixtureJackProps)

export type FixtureJackModelPropsInput = z.input<
  typeof fixtureJackModelPropsSchema
>
export type FixtureJackModelProps = z.output<typeof fixtureJackModelPropsSchema>
export type FixtureJackModelDefinition = z.output<
  typeof fixtureJackModelDefinitionSchema
>
