import {
  type PushbuttonModelPropsInput,
  pushbuttonModelPropsSchema,
} from "./schema"

export function getPushbuttonDimensions(input: PushbuttonModelPropsInput = {}) {
  const p = pushbuttonModelPropsSchema.parse(input)
  const bezelRadialOverhang = (p.headOuterDiameter - p.cutoutDiameter) / 2
  const overallLength = p.rearLength + p.headHeight
  return {
    ...p,
    bezelRadialOverhang,
    overallLength,
    rearZ: -p.rearLength,
    panelSeatZ: 0,
    frontZ: p.headHeight,
  }
}
