import {
  type FlangedTimingPulleyModelPropsInput,
  flangedTimingPulleyModelPropsSchema,
} from "./schema"

export function getFlangedTimingPulleyDimensions(
  input: FlangedTimingPulleyModelPropsInput = {},
) {
  const p = flangedTimingPulleyModelPropsSchema.parse(input)
  const pitchDiameter = (p.teeth * p.pitch) / Math.PI
  const toothTipDiameter = pitchDiameter - 1.14
  const setScrewMajorDiameter = Number(p.setScrewThread.slice(1))
  return {
    ...p,
    pitchDiameter,
    toothTipDiameter,
    setScrewMajorDiameter,
    bottomZ: -p.width / 2,
    topZ: p.width / 2,
  }
}
