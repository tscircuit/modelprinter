import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateEccentricFixtureClampProps } from "./validate"

const shape = {
  outerDiameter: positive.default(30),
  height: positive.default(10),
  boreDiameter: positive.default(6.6),
  offset: positive.default(3),
  toothDepth: positive.default(1),
  toothPitch: positive.default(3),
  topHexAcrossFlats: positive.default(5),
}

export const eccentricFixtureClampModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateEccentricFixtureClampProps)

export const eccentricFixtureClampModelDefinitionSchema = z
  .object({ fn: z.literal("eccentricfixtureclamp"), ...shape })
  .strict()
  .superRefine(validateEccentricFixtureClampProps)

export type EccentricFixtureClampModelPropsInput = z.input<
  typeof eccentricFixtureClampModelPropsSchema
>
export type EccentricFixtureClampModelProps = z.output<
  typeof eccentricFixtureClampModelPropsSchema
>
export type EccentricFixtureClampModelDefinition = z.output<
  typeof eccentricFixtureClampModelDefinitionSchema
>
