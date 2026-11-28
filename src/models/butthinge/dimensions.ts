import {
  type ButtHingeModelPropsInput,
  buttHingeModelPropsSchema,
} from "./schema"

export function getButtHingeDimensions(input: ButtHingeModelPropsInput = {}) {
  const p = buttHingeModelPropsSchema.parse(input)
  const knuckleOuterDiameter = p.pinDiameter + 2 * p.leafThickness
  const knuckleLength = p.length / p.knuckles
  const singleLeafWidth = p.openWidth / 2
  return {
    ...p,
    knuckleOuterDiameter,
    knuckleLength,
    singleLeafWidth,
    holesPerLeaf: p.holes / 2,
    bottomZ: 0,
    topZ: knuckleOuterDiameter,
  }
}
