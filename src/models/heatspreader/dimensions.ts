import {
  type HeatSpreaderModelPropsInput,
  heatSpreaderModelPropsSchema,
} from "./schema"

export function getHeatSpreaderDimensions(
  input: HeatSpreaderModelPropsInput = {},
) {
  const p = heatSpreaderModelPropsSchema.parse(input)
  const overallHeight = p.thickness + p.bossHeight
  return {
    ...p,
    overallHeight,
    bottomZ: 0,
    topZ: overallHeight,
  }
}
