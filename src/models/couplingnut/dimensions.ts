import {
  type CouplingNutModelPropsInput,
  couplingNutModelPropsSchema,
} from "./schema"
import { couplingNutDimensions } from "./table"

/** Nominal DIN 6334 dimensions in mm; lower bearing face is Z=0, upper face is Z=length. */
export function getCouplingNutDimensions(input: CouplingNutModelPropsInput) {
  const props = couplingNutModelPropsSchema.parse(input)
  const spec = couplingNutDimensions[props.metricSize]
  const acrossCorners = (2 * spec.acrossFlats) / Math.sqrt(3)
  const boreMinorDiameter =
    spec.diameter - (5 * Math.sqrt(3) * spec.threadPitch) / 8
  return {
    ...spec,
    acrossCorners,
    boreMinorDiameter,
    faceDiameter: spec.acrossFlats,
    outerChamferAngle: 30,
    outerChamferDepth: (acrossCorners - spec.acrossFlats) / (2 * Math.sqrt(3)),
    boreChamferAngle: 90,
    boreChamferDepth: (spec.mouthDiameter - boreMinorDiameter) * 0.5,
    bearingZ: 0,
    topZ: spec.length,
    threadDepth: spec.length,
  }
}
