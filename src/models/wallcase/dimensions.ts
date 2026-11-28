import {
  type WallCaseModelPropsInput,
  wallCaseModelPropsSchema,
} from "./schema"

export function getWallCaseDimensions(input: WallCaseModelPropsInput = {}) {
  const p = wallCaseModelPropsSchema.parse(input)
  const innerWidth = p.width - 2 * p.wallThickness
  const innerHeight = p.height - 2 * p.wallThickness
  const innerDepth = p.depth - 2 * p.wallThickness
  return {
    ...p,
    innerWidth,
    innerHeight,
    innerDepth,
    bottomZ: 0,
    topZ: p.depth,
  }
}
