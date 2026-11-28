import { type SnapBoxModelPropsInput, snapBoxModelPropsSchema } from "./schema"

export function getSnapBoxDimensions(input: SnapBoxModelPropsInput = {}) {
  const p = snapBoxModelPropsSchema.parse(input)
  const lidSeatZ = p.height - p.lidThickness
  const hookTipZ = lidSeatZ - p.recessLap
  const innerWidth = p.width - 2 * p.wallThickness
  const innerDepth = p.depth - 2 * p.wallThickness
  return {
    ...p,
    lidSeatZ,
    hookTipZ,
    innerWidth,
    innerDepth,
    bottomZ: 0,
    topZ: p.height,
  }
}
