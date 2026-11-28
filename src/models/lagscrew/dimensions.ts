import {
  type LagScrewModelPropsInput,
  lagScrewModelPropsSchema,
} from "./schema"

export function getLagScrewDimensions(input: LagScrewModelPropsInput = {}) {
  const p = lagScrewModelPropsSchema.parse(input)
  const headCornerDiameter = (2 * p.acrossFlats) / Math.sqrt(3)
  const unthreadedShankLength = p.length - p.threadLength
  const overallLength = p.length + p.headHeight
  return {
    ...p,
    headCornerDiameter,
    unthreadedShankLength,
    overallLength,
    bottomZ: -p.length,
    topZ: p.headHeight,
  }
}
