import {
  type GasketBoxModelPropsInput,
  gasketBoxModelPropsSchema,
} from "./schema"

export function getGasketBoxDimensions(input: GasketBoxModelPropsInput = {}) {
  const p = gasketBoxModelPropsSchema.parse(input)
  const baseBodyHeight = p.height - p.lidThickness
  const rimTotalThickness = p.wallThickness + p.grooveWidth
  const innerWidth = p.width - 2 * p.wallThickness
  const innerDepth = p.depth - 2 * p.wallThickness
  return {
    ...p,
    baseBodyHeight,
    rimTotalThickness,
    innerWidth,
    innerDepth,
    grooveFloorZ: baseBodyHeight - p.grooveDepth,
    seamZ: baseBodyHeight,
    bottomZ: 0,
    topZ: p.height,
  }
}
