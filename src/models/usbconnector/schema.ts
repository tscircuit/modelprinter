import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateUsbConnectorProps } from "./validate"

const shape = {
  te292304_1: z.literal(true).default(true),
  usb2TypeB: z.literal(true).default(true),
  width: positive.default(12.04),
  height: positive.default(11.5),
  length: positive.default(15.71),
  throughHole: z.literal(true).default(true),
  horizontal: z.literal(true).default(true),
  contacts: z.literal(4).default(4),
  shield: z.boolean().default(true),
  mountPitch: positive.default(12.04),
  mountHoleDiameter: positive.default(2.3),
  tailLength: positive.default(3.01),
}

export const usbConnectorModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateUsbConnectorProps)

export const usbConnectorModelDefinitionSchema = z
  .object({ fn: z.literal("usbconnector"), ...shape })
  .strict()
  .superRefine(validateUsbConnectorProps)

export type UsbConnectorModelPropsInput = z.input<
  typeof usbConnectorModelPropsSchema
>
export type UsbConnectorModelProps = z.output<
  typeof usbConnectorModelPropsSchema
>
export type UsbConnectorModelDefinition = z.output<
  typeof usbConnectorModelDefinitionSchema
>
