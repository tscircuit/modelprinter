import {
  type TerminalCoverModelPropsInput,
  terminalCoverModelPropsSchema,
} from "./schema"

export function getTerminalCoverDimensions(
  input: TerminalCoverModelPropsInput = {},
) {
  const p = terminalCoverModelPropsSchema.parse(input)
  const overallDepthWithFeet = p.depth + 2 * p.footWidth
  const innerClearHeight = p.height - p.thickness
  return {
    ...p,
    overallDepthWithFeet,
    innerClearHeight,
    bottomZ: 0,
    topZ: p.height,
  }
}
