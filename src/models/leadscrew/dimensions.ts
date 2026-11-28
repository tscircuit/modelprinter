import {
  type LeadScrewModelPropsInput,
  leadScrewModelPropsSchema,
} from "./schema"

export function getLeadScrewDimensions(input: LeadScrewModelPropsInput = {}) {
  const p = leadScrewModelPropsSchema.parse(input)
  const flankAngleDeg = 30
  const pitchDiameter = p.diameter - 0.5 * p.threadPitch
  const rootDiameter = p.diameter - p.threadPitch
  const helixAngleDeg =
    (Math.atan(p.lead / (Math.PI * pitchDiameter)) * 180) / Math.PI
  return {
    ...p,
    flankAngleDeg,
    pitchDiameter,
    rootDiameter,
    helixAngleDeg,
    bottomZ: 0,
    topZ: p.length,
  }
}
