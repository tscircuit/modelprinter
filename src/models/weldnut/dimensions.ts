import { type WeldNutModelPropsInput, weldNutModelPropsSchema } from "./schema"

export function getWeldNutDimensions(input: WeldNutModelPropsInput = {}) {
  const p = weldNutModelPropsSchema.parse(input)
  return {
    ...p,
    overallHeight: p.height + p.projectionHeight,
    weldTipZ: -p.projectionHeight,
    topZ: p.height,
  }
}
