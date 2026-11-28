import {
  type EdgeClipModelPropsInput,
  edgeClipModelPropsSchema,
} from "./schema"

export function getEdgeClipDimensions(input: EdgeClipModelPropsInput = {}) {
  const p = edgeClipModelPropsSchema.parse(input)
  return {
    ...p,
    throatClearanceAtBarbs: p.panelGap - 2 * p.barbHeight,
    foldZ: 0,
    mouthZ: p.length,
  }
}
