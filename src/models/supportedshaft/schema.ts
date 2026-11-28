import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateSupportedShaftProps } from "./validate"

const shape = {
  shaftDiameter: positive.default(16),
  length: positive.default(300),
  baseWidth: positive.default(40),
  baseHeight: positive.default(20),
  holePitch: positive.default(50),
  holeDiameter: positive.default(6),
  shaftCenterHeight: positive.default(28),
  baseHoles: z.boolean().default(true),
}

export const supportedShaftModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateSupportedShaftProps)

export const supportedShaftModelDefinitionSchema = z
  .object({ fn: z.literal("supportedshaft"), ...shape })
  .strict()
  .superRefine(validateSupportedShaftProps)

export type SupportedShaftModelPropsInput = z.input<
  typeof supportedShaftModelPropsSchema
>
export type SupportedShaftModelProps = z.output<
  typeof supportedShaftModelPropsSchema
>
export type SupportedShaftModelDefinition = z.output<
  typeof supportedShaftModelDefinitionSchema
>
