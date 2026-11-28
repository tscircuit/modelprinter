import {
  type PlowBoltModelPropsInput,
  plowBoltModelPropsSchema,
} from "./schema"

export function getPlowBoltDimensions(input: PlowBoltModelPropsInput = {}) {
  const p = plowBoltModelPropsSchema.parse(input)
  const majorDiameter = Number(p.thread.slice(1))
  const headConeHeight =
    (p.headOuterDiameter - p.neckWidth) /
    (2 * Math.tan((p.headAngleDeg * Math.PI) / 360))
  return {
    ...p,
    majorDiameter,
    headConeHeight,
    bottomZ: -p.length,
    topZ: 0,
  }
}
