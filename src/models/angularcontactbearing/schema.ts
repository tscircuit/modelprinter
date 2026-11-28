import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateAngularContactBearingProps } from "./validate"

const shape = {
  innerDiameter: positive.default(15),
  outerDiameter: positive.default(35),
  width: positive.default(11),
  contactAngle: z.number().finite().gt(0).lt(90).default(40),
  rows: z.literal(1).default(1),
  open: z.literal(true).default(true),
}

export const angularContactBearingModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateAngularContactBearingProps)

export const angularContactBearingModelDefinitionSchema = z
  .object({ fn: z.literal("angularcontactbearing"), ...shape })
  .strict()
  .superRefine(validateAngularContactBearingProps)

export type AngularContactBearingModelPropsInput = z.input<
  typeof angularContactBearingModelPropsSchema
>
export type AngularContactBearingModelProps = z.output<
  typeof angularContactBearingModelPropsSchema
>
export type AngularContactBearingModelDefinition = z.output<
  typeof angularContactBearingModelDefinitionSchema
>
