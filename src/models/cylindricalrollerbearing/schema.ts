import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateCylindricalRollerBearingProps } from "./validate"

const shape = {
  innerDiameter: positive.default(25),
  outerDiameter: positive.default(52),
  width: positive.default(15),
  rows: z.number().int().min(1).max(2).default(1),
  layout: z.enum(["nu", "nj", "nup"]).default("nu"),
  closure: z.enum(["open", "shielded", "sealed"]).default("open"),
}

export const cylindricalRollerBearingModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateCylindricalRollerBearingProps)

export const cylindricalRollerBearingModelDefinitionSchema = z
  .object({ fn: z.literal("cylindricalrollerbearing"), ...shape })
  .strict()
  .superRefine(validateCylindricalRollerBearingProps)

export type CylindricalRollerBearingModelPropsInput = z.input<
  typeof cylindricalRollerBearingModelPropsSchema
>
export type CylindricalRollerBearingModelProps = z.output<
  typeof cylindricalRollerBearingModelPropsSchema
>
export type CylindricalRollerBearingModelDefinition = z.output<
  typeof cylindricalRollerBearingModelDefinitionSchema
>
