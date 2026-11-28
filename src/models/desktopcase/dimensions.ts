import {
  type DesktopCaseModelPropsInput,
  desktopCaseModelPropsSchema,
} from "./schema"

export function getDesktopCaseDimensions(
  input: DesktopCaseModelPropsInput = {},
) {
  const p = desktopCaseModelPropsSchema.parse(input)
  const innerWidth = p.width - 2 * p.wallThickness
  const innerDepth = p.depth - 2 * p.wallThickness
  const innerHeight = p.height - 2 * p.wallThickness
  return {
    ...p,
    innerWidth,
    innerDepth,
    innerHeight,
    bottomZ: 0,
    topZ: p.height,
  }
}
