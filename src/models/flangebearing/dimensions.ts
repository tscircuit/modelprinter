import {
  type FlangeBearingModelPropsInput,
  flangeBearingModelPropsSchema,
} from "./schema"

export function getFlangeBearingDimensions(
  input: FlangeBearingModelPropsInput = {},
) {
  const p = flangeBearingModelPropsSchema.parse(input)
  const flangeThickness = Math.max(8, p.depth * 0.35)
  const boltCircleDiameter = Math.hypot(p.holeGridX, p.holeGridY)
  return {
    ...p,
    flangeThickness,
    boltCircleDiameter,
    bottomZ: 0,
    topZ: p.depth,
  }
}
