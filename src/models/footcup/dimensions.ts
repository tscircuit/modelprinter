import { type FootCupModelPropsInput, footCupModelPropsSchema } from "./schema"

export function getFootCupDimensions(input: FootCupModelPropsInput = {}) {
  const p = footCupModelPropsSchema.parse(input)
  const pocketDepth = p.height - p.floorThickness
  return {
    ...p,
    pocketDepth,
    bottomZ: 0,
    topZ: p.height,
  }
}
