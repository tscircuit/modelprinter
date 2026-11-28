import {
  type JunctionBoxModelPropsInput,
  junctionBoxModelPropsSchema,
} from "./schema"

export function getJunctionBoxDimensions(
  input: JunctionBoxModelPropsInput = {},
) {
  const p = junctionBoxModelPropsSchema.parse(input)
  const innerWidth = p.width - 2 * p.wallThickness
  const innerDepth = p.depth - 2 * p.wallThickness
  const knockoutCenterZ = (p.height - p.wallThickness) / 2
  return {
    ...p,
    innerWidth,
    innerDepth,
    knockoutCenterZ,
    bottomZ: 0,
    topZ: p.height,
  }
}
