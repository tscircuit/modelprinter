import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateCartridgeBearingProps } from "./validate"

const shape = {
  boreDiameter: positive.default(25),
  outerDiameter: positive.default(62),
  length: positive.default(45),
  cylindricalFit: z.literal(true).default(true),
  locatingFlangeOuterDiameter: positive.default(75),
  flangeHeight: positive.default(5),
}

export const cartridgeBearingModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateCartridgeBearingProps)

export const cartridgeBearingModelDefinitionSchema = z
  .object({ fn: z.literal("cartridgebearing"), ...shape })
  .strict()
  .superRefine(validateCartridgeBearingProps)

export type CartridgeBearingModelPropsInput = z.input<
  typeof cartridgeBearingModelPropsSchema
>
export type CartridgeBearingModelProps = z.output<
  typeof cartridgeBearingModelPropsSchema
>
export type CartridgeBearingModelDefinition = z.output<
  typeof cartridgeBearingModelDefinitionSchema
>
