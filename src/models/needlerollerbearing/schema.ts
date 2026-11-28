import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateNeedleRollerBearingProps } from "./validate"

const shape = {
  innerDiameter: positive.default(20),
  outerDiameter: positive.default(28),
  width: positive.default(20),
  rows: z.number().int().min(1).max(2).default(1),
  innerRing: z.number().int().min(0).max(1).default(1),
  closure: z.enum(["open", "sealed"]).default("open"),
}

export const needleRollerBearingModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateNeedleRollerBearingProps)

export const needleRollerBearingModelDefinitionSchema = z
  .object({ fn: z.literal("needlerollerbearing"), ...shape })
  .strict()
  .superRefine(validateNeedleRollerBearingProps)

export type NeedleRollerBearingModelPropsInput = z.input<
  typeof needleRollerBearingModelPropsSchema
>
export type NeedleRollerBearingModelProps = z.output<
  typeof needleRollerBearingModelPropsSchema
>
export type NeedleRollerBearingModelDefinition = z.output<
  typeof needleRollerBearingModelDefinitionSchema
>
