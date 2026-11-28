import {
  type UsbConnectorModelPropsInput,
  usbConnectorModelPropsSchema,
} from "./schema"

export function getUsbConnectorDimensions(
  input: UsbConnectorModelPropsInput = {},
) {
  const p = usbConnectorModelPropsSchema.parse(input)
  const signalPitchX = 2.5
  const signalRowSpanY = 2.0
  return {
    ...p,
    signalPitchX,
    signalRowSpanY,
    mountTabLeftX: -p.mountPitch / 2,
    mountTabRightX: p.mountPitch / 2,
    frontY: -p.length / 2,
    rearY: p.length / 2,
    bottomZ: -p.tailLength,
    seatZ: 0,
    topZ: p.height,
  }
}
