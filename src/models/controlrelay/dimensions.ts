import {
  type ControlRelayModelPropsInput,
  controlRelayModelPropsSchema,
} from "./schema"

export function getControlRelayDimensions(
  input: ControlRelayModelPropsInput = {},
) {
  const p = controlRelayModelPropsSchema.parse(input)
  const pinLength = 5.5
  const centerSpigotDiameter = Math.min(
    3.2,
    p.pinCircleDiameter - p.pinDiameter * 2,
  )
  const angularPitchDeg = 360 / p.pins
  return {
    ...p,
    pinLength,
    centerSpigotDiameter,
    angularPitchDeg,
    bottomPinTipZ: -pinLength,
    seatZ: 0,
    topZ: p.height,
  }
}
