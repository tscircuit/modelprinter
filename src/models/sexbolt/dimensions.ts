import { type SexBoltModelPropsInput, sexBoltModelPropsSchema } from "./schema"

export function getSexBoltDimensions(input: SexBoltModelPropsInput = {}) {
  const p = sexBoltModelPropsSchema.parse(input)
  const majorDiameter = Number(p.thread.slice(1))
  const gripLength = p.barrelLength
  const assembledOverallHeight = p.barrelLength + 2 * p.flangeHeight
  return {
    ...p,
    majorDiameter,
    gripLength,
    assembledOverallHeight,
    bottomZ: -p.flangeHeight,
    topZ: p.barrelLength + p.flangeHeight,
  }
}
