import {
  type TimingPulleyModelPropsInput,
  timingPulleyModelPropsSchema,
} from "./schema"

export function getTimingPulleyDimensions(
  input: TimingPulleyModelPropsInput = {},
) {
  const p = timingPulleyModelPropsSchema.parse(input)
  const pitchDiameter = (p.teeth * p.pitch) / Math.PI
  const outerDiameter = pitchDiameter - 1.14
  const toothDepth = 2.06
  const rootDiameter = outerDiameter - 2 * toothDepth
  const setScrewDiameter = Number(p.thread.slice(1))
  return {
    ...p,
    pitchDiameter,
    outerDiameter,
    toothDepth,
    rootDiameter,
    setScrewDiameter,
    bottomZ: 0,
    topZ: p.width,
  }
}
