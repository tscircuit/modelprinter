import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateSanitaryClampFerruleProps } from "./validate"

const shape = {
  tubeOuterDiameter: positive.default(25.4),
  tubeInnerDiameter: positive.default(22.1),
  flangeOuterDiameter: positive.default(50.5),
  length: positive.default(21.5),
  din32676: z.literal(true).default(true),
  seriesC: z.literal(true).default(true),
}

export const sanitaryClampFerruleModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateSanitaryClampFerruleProps)

export const sanitaryClampFerruleModelDefinitionSchema = z
  .object({ fn: z.literal("sanitaryclampferrule"), ...shape })
  .strict()
  .superRefine(validateSanitaryClampFerruleProps)

export type SanitaryClampFerruleModelPropsInput = z.input<
  typeof sanitaryClampFerruleModelPropsSchema
>
export type SanitaryClampFerruleModelProps = z.output<
  typeof sanitaryClampFerruleModelPropsSchema
>
export type SanitaryClampFerruleModelDefinition = z.output<
  typeof sanitaryClampFerruleModelDefinitionSchema
>
