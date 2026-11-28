import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateConcreteScrewProps } from "./validate"

const shape = {
  custom: z.literal(true).default(true),
  diameter: positive.default(6),
  coreDiameter: positive.default(4),
  length: positive.default(50),
  threadPitch: positive.default(2),
  rightHanded: z.boolean().default(true),
  hiLoThread: z.literal(true).default(true),
  lowCrestDiameter: positive.default(5),
  hexFlange: z.literal(true).default(true),
  acrossFlats: positive.default(8),
  flangeOuterDiameter: positive.default(11),
  headHeight: positive.default(4),
  notchedConeTip: z.literal(true).default(true),
  cuts: z.number().int().min(1).max(6).default(2),
  cutLength: positive.default(5),
}

export const concreteScrewModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateConcreteScrewProps)

export const concreteScrewModelDefinitionSchema = z
  .object({ fn: z.literal("concretescrew"), ...shape })
  .strict()
  .superRefine(validateConcreteScrewProps)

export type ConcreteScrewModelPropsInput = z.input<
  typeof concreteScrewModelPropsSchema
>
export type ConcreteScrewModelProps = z.output<
  typeof concreteScrewModelPropsSchema
>
export type ConcreteScrewModelDefinition = z.output<
  typeof concreteScrewModelDefinitionSchema
>
