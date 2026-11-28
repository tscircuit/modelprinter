import {
  type SquareNutModelPropsInput,
  squareNutModelPropsSchema,
} from "./schema"

export function getSquareNutDimensions(input: SquareNutModelPropsInput = {}) {
  const p = squareNutModelPropsSchema.parse(input)
  const majorDiameter = Number(p.thread.slice(1))
  const acrossCorners = p.width * Math.SQRT2
  return {
    ...p,
    majorDiameter,
    acrossCorners,
    bottomZ: 0,
    topZ: p.height,
  }
}
