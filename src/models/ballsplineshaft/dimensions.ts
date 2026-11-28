import {
  type BallSplineShaftModelPropsInput,
  ballSplineShaftModelPropsSchema,
} from "./schema"

export function getBallSplineShaftDimensions(
  input: BallSplineShaftModelPropsInput = {},
) {
  const p = ballSplineShaftModelPropsSchema.parse(input)
  const angularSpacingDeg = 360 / p.grooves
  return {
    ...p,
    angularSpacingDeg,
    bottomZ: 0,
    topZ: p.length,
  }
}
