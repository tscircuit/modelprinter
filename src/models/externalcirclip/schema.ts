import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateExternalCirclipProps } from "./validate"

const shape = {
  din471: z.literal(true).default(true),
  shaftDiameter: positive,
  free: z.literal(true).default(true),
}

export const externalCirclipModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateExternalCirclipProps)

export const externalCirclipModelDefinitionSchema = z
  .object({ fn: z.literal("externalcirclip"), ...shape })
  .strict()
  .superRefine(validateExternalCirclipProps)

export type ExternalCirclipModelPropsInput = z.input<
  typeof externalCirclipModelPropsSchema
>
export type ExternalCirclipModelProps = z.output<
  typeof externalCirclipModelPropsSchema
>
export type ExternalCirclipModelDefinition = z.output<
  typeof externalCirclipModelDefinitionSchema
>
