import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateHoneycombPanelProps } from "./validate"

const shape = {
  length: positive.default(200),
  width: positive.default(100),
  thickness: positive.default(10),
  skinThickness: positive.default(0.5),
  hexAcrossFlats: positive.default(6),
  coreWallThickness: positive.default(0.1),
}

export const honeycombPanelModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateHoneycombPanelProps)

export const honeycombPanelModelDefinitionSchema = z
  .object({ fn: z.literal("honeycombpanel"), ...shape })
  .strict()
  .superRefine(validateHoneycombPanelProps)

export type HoneycombPanelModelPropsInput = z.input<
  typeof honeycombPanelModelPropsSchema
>
export type HoneycombPanelModelProps = z.output<
  typeof honeycombPanelModelPropsSchema
>
export type HoneycombPanelModelDefinition = z.output<
  typeof honeycombPanelModelDefinitionSchema
>
