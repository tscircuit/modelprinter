import {
  type OvalFlangeBearingModelPropsInput,
  ovalFlangeBearingModelPropsSchema,
} from "./schema"

export function getOvalFlangeBearingDimensions(
  input: OvalFlangeBearingModelPropsInput = {},
) {
  const p = ovalFlangeBearingModelPropsSchema.parse(input)
  const flangeThickness = Math.min(12, p.depth * 0.35)
  return {
    ...p,
    flangeThickness,
    mountingHoleCount: 2,
    bottomZ: 0,
    topZ: p.depth,
  }
}
