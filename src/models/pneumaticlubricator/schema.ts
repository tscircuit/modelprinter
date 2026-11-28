import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validatePneumaticLubricatorProps } from "./validate"

const shape = {
  portNominal: positive.default(6.35),
  bowlOuterDiameter: positive.default(35),
  height: positive.default(110),
  headWidth: positive.default(45),
  headDepth: positive.default(40),
  domeOuterDiameter: positive.default(15),
  domeHeight: positive.default(15),
  holePitch: positive.default(30),
  holes: z.number().int().min(2).max(4).default(2),
  holeDiameter: positive.default(5),
  sightDome: z.boolean().default(true),
}

export const pneumaticLubricatorModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validatePneumaticLubricatorProps)

export const pneumaticLubricatorModelDefinitionSchema = z
  .object({ fn: z.literal("pneumaticlubricator"), ...shape })
  .strict()
  .superRefine(validatePneumaticLubricatorProps)

export type PneumaticLubricatorModelPropsInput = z.input<
  typeof pneumaticLubricatorModelPropsSchema
>
export type PneumaticLubricatorModelProps = z.output<
  typeof pneumaticLubricatorModelPropsSchema
>
export type PneumaticLubricatorModelDefinition = z.output<
  typeof pneumaticLubricatorModelDefinitionSchema
>
