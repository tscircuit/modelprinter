import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateSnapButtonProps } from "./validate"

const shape = {
  buttonDiameter: positive.default(8),
  buttonHeight: positive.default(4),
  springWidth: positive.default(8),
  springThickness: positive.default(0.5),
  legLength: positive.default(25),
  legAngle: z.number().gt(10).max(80).default(40),
  tubeInnerDiameter: positive.default(20),
}

export const snapButtonModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateSnapButtonProps)

export const snapButtonModelDefinitionSchema = z
  .object({ fn: z.literal("snapbutton"), ...shape })
  .strict()
  .superRefine(validateSnapButtonProps)

export type SnapButtonModelPropsInput = z.input<
  typeof snapButtonModelPropsSchema
>
export type SnapButtonModelProps = z.output<typeof snapButtonModelPropsSchema>
export type SnapButtonModelDefinition = z.output<
  typeof snapButtonModelDefinitionSchema
>
