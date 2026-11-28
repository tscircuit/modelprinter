import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateFlangedBallBearingProps } from "./validate"

const shape = {
  innerDiameter: positive.default(8),
  outerDiameter: positive.default(22),
  width: positive.default(7),
  flangeOuterDiameter: positive.default(25),
  rows: z.number().int().min(1).max(2).default(1),
  flangeThickness: positive.default(1.5),
  closure: z.enum(["open", "shielded", "sealed"]).default("open"),
}

export const flangedBallBearingModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateFlangedBallBearingProps)

export const flangedBallBearingModelDefinitionSchema = z
  .object({ fn: z.literal("flangedballbearing"), ...shape })
  .strict()
  .superRefine(validateFlangedBallBearingProps)

export type FlangedBallBearingModelPropsInput = z.input<
  typeof flangedBallBearingModelPropsSchema
>
export type FlangedBallBearingModelProps = z.output<
  typeof flangedBallBearingModelPropsSchema
>
export type FlangedBallBearingModelDefinition = z.output<
  typeof flangedBallBearingModelDefinitionSchema
>
