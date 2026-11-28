import {
  type TriangularBarModelPropsInput,
  triangularBarModelPropsSchema,
} from "./schema"

export function getTriangularBarDimensions(
  input: TriangularBarModelPropsInput = {},
) {
  const p = triangularBarModelPropsSchema.parse(input)
  const altitude = (p.sideLength * Math.sqrt(3)) / 2
  return {
    ...p,
    altitude,
    bottomZ: 0,
    topZ: p.length,
  }
}
