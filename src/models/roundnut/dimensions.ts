import {
  type RoundNutModelPropsInput,
  roundNutModelPropsSchema,
} from "./schema"

export function getRoundNutDimensions(input: RoundNutModelPropsInput = {}) {
  const p = roundNutModelPropsSchema.parse(input)
  const majorDiameter = Number(p.thread.slice(1))
  const rootRingDiameter = p.outerDiameter - 2 * p.slotDepth
  return {
    ...p,
    majorDiameter,
    rootRingDiameter,
    bottomZ: 0,
    topZ: p.height,
  }
}
