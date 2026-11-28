import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateCaptivePanelPinProps } from "./validate"

const shape = {
  pinDiameter: positive.default(6),
  length: positive.default(25),
  knobOuterDiameter: positive.default(15),
  knobHeight: positive.default(8),
  collarOuterDiameter: positive.default(10),
  collarHeight: positive.default(2),
  springOuterDiameter: positive.default(8),
  wireDiameter: positive.default(0.8),
  stroke: positive.default(5),
  extended: z.literal(true).default(true),
}

export const captivePanelPinModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateCaptivePanelPinProps)

export const captivePanelPinModelDefinitionSchema = z
  .object({ fn: z.literal("captivepanelpin"), ...shape })
  .strict()
  .superRefine(validateCaptivePanelPinProps)

export type CaptivePanelPinModelPropsInput = z.input<
  typeof captivePanelPinModelPropsSchema
>
export type CaptivePanelPinModelProps = z.output<
  typeof captivePanelPinModelPropsSchema
>
export type CaptivePanelPinModelDefinition = z.output<
  typeof captivePanelPinModelDefinitionSchema
>
