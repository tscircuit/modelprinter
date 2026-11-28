import {
  type SplitTubeModelPropsInput,
  splitTubeModelPropsSchema,
} from "./schema"

export function getSplitTubeDimensions(input: SplitTubeModelPropsInput = {}) {
  const p = splitTubeModelPropsSchema.parse(input)
  const innerDiameter = p.outerDiameter - 2 * p.wallThickness
  return {
    ...p,
    innerDiameter,
    bottomZ: 0,
    topZ: p.length,
  }
}
