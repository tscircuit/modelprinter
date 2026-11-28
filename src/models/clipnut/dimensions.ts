import { type ClipNutModelPropsInput, clipNutModelPropsSchema } from "./schema"

export function getClipNutDimensions(input: ClipNutModelPropsInput = {}) {
  const p = clipNutModelPropsSchema.parse(input)
  return {
    ...p,
    overallStackHeight: p.panelGap + 2 * p.stripThickness + p.barrelHeight,
    panelMidZ: 0,
  }
}
