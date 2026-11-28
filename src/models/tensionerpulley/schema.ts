import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateTensionerPulleyProps } from "./validate"

const shape = {
  outerDiameter: positive.default(40),
  width: positive.default(15),
  armLength: positive.default(60),
  pivotDiameter: positive.default(8),
  bearingBore: positive.default(8),
  springHoleDiameter: positive.default(5),
  pivotBore: z.literal(true).default(true),
}

export const tensionerPulleyModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateTensionerPulleyProps)

export const tensionerPulleyModelDefinitionSchema = z
  .object({ fn: z.literal("tensionerpulley"), ...shape })
  .strict()
  .superRefine(validateTensionerPulleyProps)

export type TensionerPulleyModelPropsInput = z.input<
  typeof tensionerPulleyModelPropsSchema
>
export type TensionerPulleyModelProps = z.output<
  typeof tensionerPulleyModelPropsSchema
>
export type TensionerPulleyModelDefinition = z.output<
  typeof tensionerPulleyModelDefinitionSchema
>
