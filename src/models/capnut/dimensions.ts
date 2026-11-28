import { type CapNutModelPropsInput, capNutModelPropsSchema } from "./schema"
import { capNutDimensions } from "./table"

/** Nominal DIN 1587 dimensions in mm; lower bearing face is Z=0, dome apex is Z=height. */
export function getCapNutDimensions(input: CapNutModelPropsInput) {
  const props = capNutModelPropsSchema.parse(input)
  const spec = capNutDimensions[props.metricSize]
  const acrossCorners = (2 * spec.acrossFlats) / Math.sqrt(3)
  const boreMinorDiameter =
    spec.diameter - (5 * Math.sqrt(3) * spec.threadPitch) / 8
  return {
    ...spec,
    acrossCorners,
    boreMinorDiameter,
    domeRadius: spec.capDiameter * 0.5,
    domeHeight: spec.height - spec.hexHeight,
    faceDiameter: spec.acrossFlats,
    outerChamferAngle: 30,
    outerChamferDepth: (acrossCorners - spec.acrossFlats) / (2 * Math.sqrt(3)),
    boreChamferAngle: 90,
    boreChamferDepth: (spec.mouthDiameter - boreMinorDiameter) * 0.5,
    bearingZ: 0,
    hexTopZ: spec.hexHeight,
    topZ: spec.height,
  }
}
