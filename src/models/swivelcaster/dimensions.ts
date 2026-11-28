import {
  type SwivelCasterModelPropsInput,
  swivelCasterModelPropsSchema,
} from "./schema"

export function getSwivelCasterDimensions(
  input: SwivelCasterModelPropsInput = {},
) {
  const p = swivelCasterModelPropsSchema.parse(input)
  const plateThickness = 3
  const swivelHeadClearance = Math.max(12, p.wheelDiameter * 0.3)
  const overallHeight = p.wheelDiameter + swivelHeadClearance + plateThickness
  const sweptSwivelRadius = p.swivelOffset + p.wheelDiameter / 2
  return {
    ...p,
    plateThickness,
    overallHeight,
    sweptSwivelRadius,
    floorZ: -overallHeight,
    plateSeatZ: 0,
  }
}
