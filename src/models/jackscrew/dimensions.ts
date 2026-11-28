import {
  type JackScrewModelPropsInput,
  jackScrewModelPropsSchema,
} from "./schema"

export function getJackScrewDimensions(input: JackScrewModelPropsInput = {}) {
  const p = jackScrewModelPropsSchema.parse(input)
  const majorDiameter = Number(p.thread.slice(1))
  const overallHeight = p.length + p.headHeight + p.padHeight
  return {
    ...p,
    majorDiameter,
    overallHeight,
    bottomZ: 0,
    topZ: overallHeight,
  }
}
