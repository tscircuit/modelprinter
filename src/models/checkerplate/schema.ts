import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateCheckerPlateProps } from "./validate"

const shape = {
  length: positive.default(200),
  width: positive.default(100),
  thickness: positive.default(3),
  rise: positive.default(1),
  treadLength: positive.default(12),
  treadWidth: positive.default(3),
  pitchX: positive.default(20),
  pitchY: positive.default(20),
  treadAngle: z.number().gt(0).lt(90).default(45),
}

export const checkerPlateModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateCheckerPlateProps)

export const checkerPlateModelDefinitionSchema = z
  .object({ fn: z.literal("checkerplate"), ...shape })
  .strict()
  .superRefine(validateCheckerPlateProps)

export type CheckerPlateModelPropsInput = z.input<
  typeof checkerPlateModelPropsSchema
>
export type CheckerPlateModelProps = z.output<
  typeof checkerPlateModelPropsSchema
>
export type CheckerPlateModelDefinition = z.output<
  typeof checkerPlateModelDefinitionSchema
>
