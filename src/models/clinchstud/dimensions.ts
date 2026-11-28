import {
  type ClinchStudModelPropsInput,
  clinchStudModelPropsSchema,
} from "./schema"

export function getClinchStudDimensions(input: ClinchStudModelPropsInput = {}) {
  const p = clinchStudModelPropsSchema.parse(input)
  const majorDiameter = Number(p.thread.slice(1))
  const overallLength = p.length + p.headHeight
  return {
    ...p,
    majorDiameter,
    overallLength,
    bottomZ: -p.headHeight,
    topZ: p.length,
  }
}
