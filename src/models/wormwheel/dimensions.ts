import {
  type WormWheelModelPropsInput,
  wormWheelModelPropsSchema,
} from "./schema"

export function getWormWheelDimensions(input: WormWheelModelPropsInput = {}) {
  const p = wormWheelModelPropsSchema.parse(input)
  const pitchDiameter = p.teeth * p.axialModule
  const throatDiameter = pitchDiameter + 2 * p.axialModule
  const outerDiameter = throatDiameter + p.axialModule
  const rootDiameter = pitchDiameter - 2.5 * p.axialModule
  const centerDistance = (pitchDiameter + p.wormPitchDiameter) / 2
  const gearRatio = p.teeth / p.starts
  return {
    ...p,
    pitchDiameter,
    throatDiameter,
    outerDiameter,
    rootDiameter,
    centerDistance,
    gearRatio,
    bottomZ: 0,
    topZ: p.width,
  }
}
