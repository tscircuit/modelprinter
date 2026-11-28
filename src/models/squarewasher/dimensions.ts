import {
  type SquareWasherModelPropsInput,
  squareWasherModelPropsSchema,
} from "./schema"

export function getSquareWasherDimensions(
  input: SquareWasherModelPropsInput = {},
) {
  const p = squareWasherModelPropsSchema.parse(input)
  const minEdgeMargin = (Math.min(p.width, p.length) - p.innerDiameter) / 2
  return {
    ...p,
    minEdgeMargin,
    bottomZ: 0,
    topZ: p.height,
  }
}
