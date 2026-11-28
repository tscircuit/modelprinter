import {
  type AxialFanModelPropsInput,
  axialFanModelPropsSchema,
} from "./schema"

export function getAxialFanDimensions(input: AxialFanModelPropsInput = {}) {
  const p = axialFanModelPropsSchema.parse(input)
  const shroudBoreDiameter = Math.min(p.width, p.height) * 0.92
  const bladeSpanRadius = (shroudBoreDiameter - p.hubOuterDiameter) / 2
  const bladeAngularPitchDeg = 360 / p.blades
  return {
    ...p,
    shroudBoreDiameter,
    bladeSpanRadius,
    bladeAngularPitchDeg,
    rearZ: -p.depth / 2,
    frontZ: p.depth / 2,
  }
}
