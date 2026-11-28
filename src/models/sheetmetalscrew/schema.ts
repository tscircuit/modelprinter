import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { normalizeSheetMetalScrewProps } from "./normalize"
import { validateSheetMetalScrewProps } from "./validate"

const shape = {
  iso7049: z.literal(true).default(true),
  tappingSize: z.string().regex(/^st(?:\d+(?:\.\d+)?)$/i),
  threadPitch: positive.optional(),
  rightHanded: z.boolean().default(true),
  length: positive,
  typeC: z.literal(true).default(true),
  phillips: z.literal(true).default(true),
}

export const sheetMetalScrewModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateSheetMetalScrewProps)
  .transform(normalizeSheetMetalScrewProps)

export const sheetMetalScrewModelDefinitionSchema = z
  .object({ fn: z.literal("sheetmetalscrew"), ...shape })
  .strict()
  .superRefine(validateSheetMetalScrewProps)
  .transform(normalizeSheetMetalScrewProps)

export type SheetMetalScrewModelPropsInput = z.input<
  typeof sheetMetalScrewModelPropsSchema
>
export type SheetMetalScrewModelProps = z.output<
  typeof sheetMetalScrewModelPropsSchema
>
export type SheetMetalScrewModelDefinition = z.output<
  typeof sheetMetalScrewModelDefinitionSchema
>
