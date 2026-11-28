import {
  type WingScrewModelPropsInput,
  wingScrewModelPropsSchema,
} from "./schema"

export function getWingScrewDimensions(input: WingScrewModelPropsInput = {}) {
  const p = wingScrewModelPropsSchema.parse(input)
  const majorDiameter = Number(p.thread.slice(1))
  const singleWingProjection = (p.wingSpan - p.bossOuterDiameter) / 2
  const overallLength = p.length + p.wingHeight
  return {
    ...p,
    majorDiameter,
    singleWingProjection,
    overallLength,
    wingCount: 2,
    bottomZ: -p.length,
    topZ: p.wingHeight,
  }
}
