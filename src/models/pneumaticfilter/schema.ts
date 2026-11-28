import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validatePneumaticFilterProps } from "./validate"

const shape = {
  portNominal: positive.default(6.35),
  bowlOuterDiameter: positive.default(35),
  height: positive.default(100),
  headWidth: positive.default(45),
  headDepth: positive.default(40),
  holePitch: positive.default(30),
  holes: z.number().int().min(2).max(4).default(2),
  holeDiameter: positive.default(5),
  bottomDrain: z.boolean().default(true),
}

export const pneumaticFilterModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validatePneumaticFilterProps)

export const pneumaticFilterModelDefinitionSchema = z
  .object({ fn: z.literal("pneumaticfilter"), ...shape })
  .strict()
  .superRefine(validatePneumaticFilterProps)

export type PneumaticFilterModelPropsInput = z.input<
  typeof pneumaticFilterModelPropsSchema
>
export type PneumaticFilterModelProps = z.output<
  typeof pneumaticFilterModelPropsSchema
>
export type PneumaticFilterModelDefinition = z.output<
  typeof pneumaticFilterModelDefinitionSchema
>
