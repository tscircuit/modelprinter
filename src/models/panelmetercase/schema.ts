import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validatePanelMeterCaseProps } from "./validate"

const shape = {
  width: positive.default(96),
  height: positive.default(48),
  depth: positive.default(60),
  wallThickness: positive.default(2),
  bezelThickness: positive.default(3),
  cutoutWidth: positive.default(92),
  cutoutHeight: positive.default(45),
  sideSpring2Clips: z.literal(true).default(true),
  frontWindow: z.literal(true).default(true),
}

export const panelMeterCaseModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validatePanelMeterCaseProps)

export const panelMeterCaseModelDefinitionSchema = z
  .object({ fn: z.literal("panelmetercase"), ...shape })
  .strict()
  .superRefine(validatePanelMeterCaseProps)

export type PanelMeterCaseModelPropsInput = z.input<
  typeof panelMeterCaseModelPropsSchema
>
export type PanelMeterCaseModelProps = z.output<
  typeof panelMeterCaseModelPropsSchema
>
export type PanelMeterCaseModelDefinition = z.output<
  typeof panelMeterCaseModelDefinitionSchema
>
