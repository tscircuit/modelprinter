import { type WingNutModelPropsInput, wingNutModelPropsSchema } from "./schema"
import { wingNutDimensions } from "./table"

/** Nominal DIN 315 dimensions in mm; lower boss bearing face is Z=0, wing crest is Z=height. */
export function getWingNutDimensions(input: WingNutModelPropsInput) {
  const props = wingNutModelPropsSchema.parse(input)
  const spec = wingNutDimensions[props.metricSize]
  const boreMinorDiameter =
    spec.diameter - (5 * Math.sqrt(3) * spec.threadPitch) / 8
  return {
    ...spec,
    boreMinorDiameter,
    boreChamferAngle: 90,
    boreChamferDepth: (spec.mouthDiameter - boreMinorDiameter) * 0.5,
    wingProjection: (spec.wingSpan - spec.topBossDiameter) * 0.5,
    wingTipRadius: (spec.height - spec.bossHeight) * 0.5,
    bearingZ: 0,
    bossTopZ: spec.bossHeight,
    topZ: spec.height,
    threadDepth: spec.bossHeight,
    size: [spec.wingSpan, spec.baseDiameter, spec.height] as [
      number,
      number,
      number,
    ],
  }
}
