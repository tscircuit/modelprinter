import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateRollerCatchProps } from "./validate"

const shape = {
  width: positive.default(25),
  depth: positive.default(15),
  height: positive.default(20),
  rollerDiameter: positive.default(6),
  rollerGap: positive.default(3),
  strikeWidth: positive.default(8),
  holeDiameter: positive.default(3),
  holePitch: positive.default(18),
}

export const rollerCatchModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateRollerCatchProps)

export const rollerCatchModelDefinitionSchema = z
  .object({ fn: z.literal("rollercatch"), ...shape })
  .strict()
  .superRefine(validateRollerCatchProps)

export type RollerCatchModelPropsInput = z.input<
  typeof rollerCatchModelPropsSchema
>
export type RollerCatchModelProps = z.output<typeof rollerCatchModelPropsSchema>
export type RollerCatchModelDefinition = z.output<
  typeof rollerCatchModelDefinitionSchema
>
