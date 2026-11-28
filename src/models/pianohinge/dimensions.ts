import {
  type PianoHingeModelPropsInput,
  pianoHingeModelPropsSchema,
} from "./schema"

export function getPianoHingeDimensions(input: PianoHingeModelPropsInput = {}) {
  const p = pianoHingeModelPropsSchema.parse(input)
  const knuckleOuterDiameter = p.pinDiameter + 2 * p.leafThickness
  const knuckleCount = Math.max(4, Math.round(p.length / p.knuckleLength))
  const holesPerRow = p.holes / 2
  const rowCenterOffsetX = (p.openWidth + knuckleOuterDiameter) / 4
  return {
    ...p,
    knuckleOuterDiameter,
    knuckleCount,
    holesPerRow,
    rowCenterOffsetX,
    bottomZ: 0,
    topZ: knuckleOuterDiameter,
  }
}
