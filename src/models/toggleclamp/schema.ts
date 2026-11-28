import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateToggleClampProps } from "./validate"

const shape = {
  baseWidth: positive.default(30),
  baseLength: positive.default(50),
  baseThickness: positive.default(3),
  holes: z.number().int().min(2).max(6).default(4),
  holeDiameter: positive.default(5),
  pitchX: positive.default(20),
  pitchY: positive.default(40),
  armLength: positive.default(60),
  armWidth: positive.default(10),
  armHeight: positive.default(4),
  pivotHeight: positive.default(25),
  handleLength: positive.default(70),
  padOuterDiameter: positive.default(15),
  vertical: z.boolean().default(true),
  closed: z.boolean().default(true),
}

export const toggleClampModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateToggleClampProps)

export const toggleClampModelDefinitionSchema = z
  .object({ fn: z.literal("toggleclamp"), ...shape })
  .strict()
  .superRefine(validateToggleClampProps)

export type ToggleClampModelPropsInput = z.input<
  typeof toggleClampModelPropsSchema
>
export type ToggleClampModelProps = z.output<typeof toggleClampModelPropsSchema>
export type ToggleClampModelDefinition = z.output<
  typeof toggleClampModelDefinitionSchema
>
