import {
  type DinRailEndStopModelPropsInput,
  dinRailEndStopModelPropsSchema,
} from "./schema"

export function getDinRailEndStopDimensions(
  input: DinRailEndStopModelPropsInput = {},
) {
  const p = dinRailEndStopModelPropsSchema.parse(input)
  const clampScrewMajorDiameter = Number(p.clampThread.slice(1))
  return {
    ...p,
    clampScrewMajorDiameter,
    bottomZ: 0,
    topZ: p.height,
  }
}
