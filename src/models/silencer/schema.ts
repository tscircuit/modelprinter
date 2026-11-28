import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateSilencerProps } from "./validate"

const shape = {
  portNominal: positive.default(3.175),
  outerDiameter: positive.default(15),
  length: positive.default(30),
  hexAcrossFlats: positive.default(12),
  porousCylinder: z.boolean().default(true),
  closedTip: z.boolean().default(true),
}

export const silencerModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateSilencerProps)

export const silencerModelDefinitionSchema = z
  .object({ fn: z.literal("silencer"), ...shape })
  .strict()
  .superRefine(validateSilencerProps)

export type SilencerModelPropsInput = z.input<typeof silencerModelPropsSchema>
export type SilencerModelProps = z.output<typeof silencerModelPropsSchema>
export type SilencerModelDefinition = z.output<
  typeof silencerModelDefinitionSchema
>
