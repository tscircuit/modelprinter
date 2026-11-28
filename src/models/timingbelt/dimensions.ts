import {
  type TimingBeltModelPropsInput,
  timingBeltModelPropsSchema,
} from "./schema"

export function getTimingBeltDimensions(input: TimingBeltModelPropsInput = {}) {
  const p = timingBeltModelPropsSchema.parse(input)
  const toothHeight = 2.06
  const backingThickness = p.beltHeight - toothHeight
  const pitchCircleDiameter = p.pitchLength / Math.PI
  const outerLoopDiameter = pitchCircleDiameter + 2 * (backingThickness - 0.57)
  return {
    ...p,
    toothHeight,
    backingThickness,
    pitchCircleDiameter,
    outerLoopDiameter,
    bottomZ: 0,
    topZ: p.width,
  }
}
