import {
  type SolidInsertModelPropsInput,
  solidInsertModelPropsSchema,
} from "./schema"

export function getSolidInsertDimensions(
  input: SolidInsertModelPropsInput = {},
) {
  const p = solidInsertModelPropsSchema.parse(input)
  const internalMajorDiameter = Number(p.internalThread.slice(1))
  const nominalWallThickness = (p.externalDiameter - internalMajorDiameter) / 2
  return {
    ...p,
    internalMajorDiameter,
    nominalWallThickness,
    bottomZ: -p.length,
    topZ: 0,
  }
}
