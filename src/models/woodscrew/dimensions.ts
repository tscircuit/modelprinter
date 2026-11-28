import {
  type WoodScrewModelPropsInput,
  woodScrewModelPropsSchema,
} from "./schema"

export function getWoodScrewDimensions(input: WoodScrewModelPropsInput = {}) {
  const p = woodScrewModelPropsSchema.parse(input)
  const headHeight =
    (p.headOuterDiameter - p.diameter) /
    (2 * Math.tan((p.headAngle * Math.PI) / 360))
  const unthreadedShankLength = p.length - headHeight - p.threadLength
  return {
    ...p,
    headHeight,
    unthreadedShankLength,
    bottomZ: -p.length,
    topZ: 0,
  }
}
