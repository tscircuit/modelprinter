import {
  type PlateNutModelPropsInput,
  plateNutModelPropsSchema,
} from "./schema"

export function getPlateNutDimensions(input: PlateNutModelPropsInput = {}) {
  const p = plateNutModelPropsSchema.parse(input)
  const majorDiameter = Number(p.thread.slice(1))
  const overallHeight = p.stripThickness + p.nutHeight
  return {
    ...p,
    majorDiameter,
    overallHeight,
    bottomZ: 0,
    topZ: overallHeight,
  }
}
