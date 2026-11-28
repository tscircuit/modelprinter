import {
  type FuseHolderModelPropsInput,
  fuseHolderModelPropsSchema,
} from "./schema"

export function getFuseHolderDimensions(input: FuseHolderModelPropsInput = {}) {
  const p = fuseHolderModelPropsSchema.parse(input)
  const threadNominalDiameter = Number(p.thread.slice(1))
  const capHeight = Math.max(4, p.capOuterDiameter * 0.35)
  const capFlangeRadialOverhang = (p.capOuterDiameter - p.panelHoleDiameter) / 2
  const overallLength = p.bodyLength + capHeight
  return {
    ...p,
    threadNominalDiameter,
    capHeight,
    capFlangeRadialOverhang,
    overallLength,
    rearZ: -p.bodyLength,
    panelSeatZ: 0,
    frontZ: capHeight,
  }
}
