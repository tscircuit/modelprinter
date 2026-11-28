import {
  type SpringDetentModelPropsInput,
  springDetentModelPropsSchema,
} from "./schema"

export function getSpringDetentDimensions(
  input: SpringDetentModelPropsInput = {},
) {
  const p = springDetentModelPropsSchema.parse(input)
  const majorDiameter = Number(p.thread.slice(1))
  const overallLength = p.length + p.projection
  return {
    ...p,
    majorDiameter,
    overallLength,
    bottomZ: -p.length,
    topZ: p.projection,
  }
}
