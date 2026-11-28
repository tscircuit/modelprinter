import {
  type SplitShaftCollarModelPropsInput,
  splitShaftCollarModelPropsSchema,
} from "./schema"

export function getSplitShaftCollarDimensions(
  input: SplitShaftCollarModelPropsInput = {},
) {
  const p = splitShaftCollarModelPropsSchema.parse(input)
  const boltMajorDiameter = Number(p.thread.slice(1))
  const radialWallThickness = (p.outerDiameter - p.boreDiameter) / 2
  return {
    ...p,
    boltMajorDiameter,
    radialWallThickness,
    bottomZ: 0,
    topZ: p.width,
  }
}
