import {
  type CamLatchModelPropsInput,
  camLatchModelPropsSchema,
} from "./schema"

export function getCamLatchDimensions(input: CamLatchModelPropsInput = {}) {
  const p = camLatchModelPropsSchema.parse(input)
  const headHeight = 3
  const headFlangeRadialOverhang = (p.headOuterDiameter - p.cutoutDiameter) / 2
  const camRadialProjection = p.camLength - p.camWidth / 2
  const overallAxialLength = p.barrelLength + p.camThickness + headHeight
  return {
    ...p,
    headHeight,
    headFlangeRadialOverhang,
    camRadialProjection,
    overallAxialLength,
    rearZ: -(p.barrelLength + p.camThickness),
    panelSeatZ: 0,
    frontZ: headHeight,
  }
}
