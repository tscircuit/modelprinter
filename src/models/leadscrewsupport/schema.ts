import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateLeadscrewSupportProps } from "./validate"

const shape = {
  boreDiameter: positive.default(12),
  width: positive.default(60),
  height: positive.default(43),
  depth: positive.default(25),
  holePitch: positive.default(46),
  holeDiameter: positive.default(5),
  angularPair: z.boolean().default(true),
}

export const leadscrewSupportModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateLeadscrewSupportProps)

export const leadscrewSupportModelDefinitionSchema = z
  .object({ fn: z.literal("leadscrewsupport"), ...shape })
  .strict()
  .superRefine(validateLeadscrewSupportProps)

export type LeadscrewSupportModelPropsInput = z.input<
  typeof leadscrewSupportModelPropsSchema
>
export type LeadscrewSupportModelProps = z.output<
  typeof leadscrewSupportModelPropsSchema
>
export type LeadscrewSupportModelDefinition = z.output<
  typeof leadscrewSupportModelDefinitionSchema
>
