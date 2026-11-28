import {
  type AnnularBlankModelPropsInput,
  annularBlankModelPropsSchema,
} from "./schema"

export function getAnnularBlankDimensions(
  input: AnnularBlankModelPropsInput = {},
) {
  const p = annularBlankModelPropsSchema.parse(input)
  return {
    ...p,
    radialWall: (p.outerDiameter - p.innerDiameter) / 2,
    bottomZ: -p.thickness / 2,
    topZ: p.thickness / 2,
  }
}
