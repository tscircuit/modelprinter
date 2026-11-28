import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateInternalToothWasherProps } from "./validate"

const shape = {
  innerDiameter: positive.default(6.4),
  rootInnerDiameter: positive.default(9),
  outerDiameter: positive.default(11),
  thickness: positive.default(0.8),
  teeth: z.number().int().min(4).max(32).default(10),
  toothWidth: positive.default(1),
  twistAngle: z.number().gt(0).max(45).default(15),
}

export const internalToothWasherModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateInternalToothWasherProps)

export const internalToothWasherModelDefinitionSchema = z
  .object({ fn: z.literal("internaltoothwasher"), ...shape })
  .strict()
  .superRefine(validateInternalToothWasherProps)

export type InternalToothWasherModelPropsInput = z.input<
  typeof internalToothWasherModelPropsSchema
>
export type InternalToothWasherModelProps = z.output<
  typeof internalToothWasherModelPropsSchema
>
export type InternalToothWasherModelDefinition = z.output<
  typeof internalToothWasherModelDefinitionSchema
>
