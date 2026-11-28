import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateFlangeFullFaceGasketProps } from "./validate"

const shape = {
  innerDiameter: positive.default(25),
  outerDiameter: positive.default(95),
  thickness: positive.default(2),
  holes: z.number().int().min(2).default(4),
  flat: z.literal(true).default(true),
  boltCircleDiameter: positive.default(65),
  holeDiameter: positive.default(9),
}

export const flangeFullFaceGasketModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateFlangeFullFaceGasketProps)

export const flangeFullFaceGasketModelDefinitionSchema = z
  .object({ fn: z.literal("flangefullfacegasket"), ...shape })
  .strict()
  .superRefine(validateFlangeFullFaceGasketProps)

export type FlangeFullFaceGasketModelPropsInput = z.input<
  typeof flangeFullFaceGasketModelPropsSchema
>
export type FlangeFullFaceGasketModelProps = z.output<
  typeof flangeFullFaceGasketModelPropsSchema
>
export type FlangeFullFaceGasketModelDefinition = z.output<
  typeof flangeFullFaceGasketModelDefinitionSchema
>
