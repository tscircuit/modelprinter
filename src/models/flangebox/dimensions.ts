import {
  type FlangeBoxModelPropsInput,
  flangeBoxModelPropsSchema,
} from "./schema"

export function getFlangeBoxDimensions(input: FlangeBoxModelPropsInput = {}) {
  const p = flangeBoxModelPropsSchema.parse(input)
  const overallWidth = p.width + 2 * p.flangeProjection
  const innerWidth = p.width - 2 * p.wallThickness
  const innerDepth = p.depth - 2 * p.wallThickness
  const lidThickness = p.wallThickness
  return {
    ...p,
    overallWidth,
    innerWidth,
    innerDepth,
    lidThickness,
    bottomZ: 0,
    topZ: p.height,
  }
}
