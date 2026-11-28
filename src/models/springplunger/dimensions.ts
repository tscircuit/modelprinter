import {
  type SpringPlungerModelPropsInput,
  springPlungerModelPropsSchema,
} from "./schema"

export function getSpringPlungerDimensions(
  input: SpringPlungerModelPropsInput = {},
) {
  const p = springPlungerModelPropsSchema.parse(input)
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
