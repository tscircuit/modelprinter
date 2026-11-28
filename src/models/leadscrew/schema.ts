import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { normalizeLeadScrewProps } from "./normalize"
import { validateLeadScrewProps } from "./validate"

const shape = {
  diameter: positive.default(8),
  length: positive.default(300),
  trapezoidalThread: z
    .string()
    .regex(/^tr(?:\d+(?:\.\d+)?)$/i)
    .default("tr8"),
  threadPitch: positive.default(2),
  lead: positive.default(2),
  starts: z.number().int().min(1).default(1),
  rightHanded: z.literal(true).default(true),
}

export const leadScrewModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateLeadScrewProps)
  .transform(normalizeLeadScrewProps)

export const leadScrewModelDefinitionSchema = z
  .object({ fn: z.literal("leadscrew"), ...shape })
  .strict()
  .superRefine(validateLeadScrewProps)
  .transform(normalizeLeadScrewProps)

export type LeadScrewModelPropsInput = z.input<typeof leadScrewModelPropsSchema>
export type LeadScrewModelProps = z.output<typeof leadScrewModelPropsSchema>
export type LeadScrewModelDefinition = z.output<
  typeof leadScrewModelDefinitionSchema
>
