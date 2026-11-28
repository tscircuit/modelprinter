import {
  type AntiBacklashNutModelPropsInput,
  antiBacklashNutModelPropsSchema,
} from "./schema"

export function getAntiBacklashNutDimensions(
  input: AntiBacklashNutModelPropsInput = {},
) {
  const p = antiBacklashNutModelPropsSchema.parse(input)
  const nominalThreadDiameter = Number(p.trapezoidalThread.slice(2))
  return {
    ...p,
    nominalThreadDiameter,
    bottomZ: 0,
    topZ: p.length,
  }
}
