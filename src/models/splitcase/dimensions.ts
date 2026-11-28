import {
  type SplitCaseModelPropsInput,
  splitCaseModelPropsSchema,
} from "./schema"

export function getSplitCaseDimensions(input: SplitCaseModelPropsInput = {}) {
  const p = splitCaseModelPropsSchema.parse(input)
  const upperShellHeight = p.height - p.splitHeight
  const seamLipThickness = p.wallThickness / 2
  const innerWidth = p.width - 2 * p.wallThickness
  const innerDepth = p.depth - 2 * p.wallThickness
  return {
    ...p,
    upperShellHeight,
    seamLipThickness,
    innerWidth,
    innerDepth,
    seamZ: p.splitHeight,
    bottomZ: 0,
    topZ: p.height,
  }
}
