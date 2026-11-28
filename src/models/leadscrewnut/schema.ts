import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { normalizeLeadScrewNutProps } from "./normalize"
import { validateLeadScrewNutProps } from "./validate"

const shape = {
  boreDiameter: positive.default(8),
  bodyOuterDiameter: positive.default(16),
  length: positive.default(15),
  flangeOuterDiameter: positive.default(26),
  trapezoidalThread: z
    .string()
    .regex(/^tr(?:\d+(?:\.\d+)?)$/i)
    .default("tr8"),
  threadPitch: positive.default(2),
  lead: positive.default(2),
  starts: z.number().int().min(1).default(1),
  face4Hole: z.literal(true).default(true),
  pitchCircleDiameter: positive.default(20),
  holeDiameter: positive.default(3),
}

export const leadScrewNutModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateLeadScrewNutProps)
  .transform(normalizeLeadScrewNutProps)

export const leadScrewNutModelDefinitionSchema = z
  .object({ fn: z.literal("leadscrewnut"), ...shape })
  .strict()
  .superRefine(validateLeadScrewNutProps)
  .transform(normalizeLeadScrewNutProps)

export type LeadScrewNutModelPropsInput = z.input<
  typeof leadScrewNutModelPropsSchema
>
export type LeadScrewNutModelProps = z.output<
  typeof leadScrewNutModelPropsSchema
>
export type LeadScrewNutModelDefinition = z.output<
  typeof leadScrewNutModelDefinitionSchema
>
