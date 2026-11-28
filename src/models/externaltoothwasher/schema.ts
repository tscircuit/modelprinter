import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateExternalToothWasherProps } from "./validate"

const shape = {
  custom: z.literal(true).default(true),
  innerDiameter: positive,
  bodyOuterDiameter: positive,
  outerDiameter: positive,
  thickness: positive,
  teeth: z.number().int().min(3).max(64).default(12),
  toothWidth: positive,
  twistAngle: z.number().finite().gt(0).lt(90).default(15),
}

export const externalToothWasherModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateExternalToothWasherProps)

export const externalToothWasherModelDefinitionSchema = z
  .object({ fn: z.literal("externaltoothwasher"), ...shape })
  .strict()
  .superRefine(validateExternalToothWasherProps)

export type ExternalToothWasherModelPropsInput = z.input<
  typeof externalToothWasherModelPropsSchema
>
export type ExternalToothWasherModelProps = z.output<
  typeof externalToothWasherModelPropsSchema
>
export type ExternalToothWasherModelDefinition = z.output<
  typeof externalToothWasherModelDefinitionSchema
>
