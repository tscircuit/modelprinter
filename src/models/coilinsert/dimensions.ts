import {
  type CoilInsertModelPropsInput,
  coilInsertModelPropsSchema,
} from "./schema"

export function getCoilInsertDimensions(input: CoilInsertModelPropsInput = {}) {
  const p = coilInsertModelPropsSchema.parse(input)
  const nominalDiameter = Number(p.thread.slice(1))
  const freeInnerDiameter = p.outerDiameter - 2 * p.wireWidth
  const axialPitch = p.length / p.turns
  return {
    ...p,
    nominalDiameter,
    freeInnerDiameter,
    axialPitch,
    bottomZ: 0,
    topZ: p.length,
  }
}
