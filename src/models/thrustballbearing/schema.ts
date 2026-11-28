import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { normalizeThrustBallBearingProps } from "./normalize"
import { validateThrustBallBearingProps } from "./validate"

const shape = {
  code: z.string().regex(/^\d+$/).optional(),
  innerDiameter: positive.optional(),
  outerDiameter: positive.optional(),
  height: positive.optional(),
  flatWasherPair: z.literal(true).default(true),
  rows: z.literal(1).default(1),
}

export const thrustBallBearingModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateThrustBallBearingProps)
  .transform(normalizeThrustBallBearingProps)

export const thrustBallBearingModelDefinitionSchema = z
  .object({ fn: z.literal("thrustballbearing"), ...shape })
  .strict()
  .superRefine(validateThrustBallBearingProps)
  .transform(normalizeThrustBallBearingProps)

export type ThrustBallBearingModelPropsInput = z.input<
  typeof thrustBallBearingModelPropsSchema
>
export type ThrustBallBearingModelProps = z.output<
  typeof thrustBallBearingModelPropsSchema
>
export type ThrustBallBearingModelDefinition = z.output<
  typeof thrustBallBearingModelDefinitionSchema
>
