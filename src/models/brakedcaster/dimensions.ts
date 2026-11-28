import {
  type BrakedCasterModelPropsInput,
  brakedCasterModelPropsSchema,
} from "./schema"

export function getBrakedCasterDimensions(
  input: BrakedCasterModelPropsInput = {},
) {
  const p = brakedCasterModelPropsSchema.parse(input)
  const plateThickness = 3.5
  const swivelOffset = p.wheelDiameter * 0.35
  const brakePedalOverhang = p.wheelDiameter * 0.28
  const overallHeight = p.wheelDiameter * 1.3 + plateThickness
  return {
    ...p,
    plateThickness,
    swivelOffset,
    brakePedalOverhang,
    overallHeight,
    floorZ: -overallHeight,
    plateSeatZ: 0,
  }
}
