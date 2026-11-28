import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateWoodScrewProps } from "./validate"

const shape = {
  custom: z.literal(true).default(true),
  diameter: positive.default(4),
  coreDiameter: positive.default(2.5),
  length: positive.default(25),
  threadLength: positive.default(18),
  threadPitch: positive.default(2),
  rightHanded: z.boolean().default(true),
  countersunk: z.literal(true).default(true),
  headOuterDiameter: positive.default(8),
  headAngle: z.number().finite().gt(30).lt(160).default(90),
  phillips: z.literal(true).default(true),
  coneTip: z.literal(true).default(true),
}

export const woodScrewModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateWoodScrewProps)

export const woodScrewModelDefinitionSchema = z
  .object({ fn: z.literal("woodscrew"), ...shape })
  .strict()
  .superRefine(validateWoodScrewProps)

export type WoodScrewModelPropsInput = z.input<typeof woodScrewModelPropsSchema>
export type WoodScrewModelProps = z.output<typeof woodScrewModelPropsSchema>
export type WoodScrewModelDefinition = z.output<
  typeof woodScrewModelDefinitionSchema
>
