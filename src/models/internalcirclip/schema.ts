import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateInternalCirclipProps } from "./validate"

const shape = {
  din472: z.literal(true).default(true),
  boreDiameter: positive,
  free: z.literal(true).default(true),
}

export const internalCirclipModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateInternalCirclipProps)

export const internalCirclipModelDefinitionSchema = z
  .object({ fn: z.literal("internalcirclip"), ...shape })
  .strict()
  .superRefine(validateInternalCirclipProps)

export type InternalCirclipModelPropsInput = z.input<
  typeof internalCirclipModelPropsSchema
>
export type InternalCirclipModelProps = z.output<
  typeof internalCirclipModelPropsSchema
>
export type InternalCirclipModelDefinition = z.output<
  typeof internalCirclipModelDefinitionSchema
>
