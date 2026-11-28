import { type PawlModelPropsInput, pawlModelPropsSchema } from "./schema"

export function getPawlDimensions(input: PawlModelPropsInput = {}) {
  const p = pawlModelPropsSchema.parse(input)
  const effectiveArmLength = p.length - p.pivotDiameter / 2 - p.noseRadius
  return {
    ...p,
    effectiveArmLength,
    bottomZ: 0,
    topZ: p.height,
  }
}
