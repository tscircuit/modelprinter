import {
  type WeldStudModelPropsInput,
  weldStudModelPropsSchema,
} from "./schema"

export function getWeldStudDimensions(input: WeldStudModelPropsInput = {}) {
  const p = weldStudModelPropsSchema.parse(input)
  const majorDiameter = Number(p.thread.slice(1))
  const preWeldOverallHeight = p.weldTipLength + p.baseHeight + p.length
  return {
    ...p,
    majorDiameter,
    preWeldOverallHeight,
    bottomZ: -p.weldTipLength,
    topZ: p.baseHeight + p.length,
  }
}
