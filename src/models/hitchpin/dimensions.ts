import {
  type HitchPinModelPropsInput,
  hitchPinModelPropsSchema,
} from "./schema"

export function getHitchPinDimensions(input: HitchPinModelPropsInput) {
  const p = hitchPinModelPropsSchema.parse(input)
  const shankRadius = p.diameter / 2
  const crossHoleCenterFromBendDatum = p.workingLength - p.crossHoleOffset
  const overallAxialHeight = p.workingLength + p.bendRadius + shankRadius
  const handleLateralReach = p.bendRadius + p.handleLength
  return {
    ...p,
    shankRadius,
    crossHoleCenterFromBendDatum,
    overallAxialHeight,
    handleLateralReach,
    tipZ: -p.workingLength,
    bendStartZ: 0,
    topZ: p.bendRadius + shankRadius,
  }
}
