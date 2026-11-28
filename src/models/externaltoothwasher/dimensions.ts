import {
  type ExternalToothWasherModelPropsInput,
  externalToothWasherModelPropsSchema,
} from "./schema"

export function getExternalToothWasherDimensions(
  input: ExternalToothWasherModelPropsInput,
) {
  const p = externalToothWasherModelPropsSchema.parse(input)
  const twistRad = (p.twistAngle * Math.PI) / 180
  const toothTipAxialDeflection = (p.toothWidth / 2) * Math.sin(twistRad)
  const envelopeHeight =
    p.thickness * Math.cos(twistRad) + p.toothWidth * Math.sin(twistRad)
  const effectiveHeight = Math.max(p.thickness, envelopeHeight)
  return {
    ...p,
    annularRingWidth: (p.bodyOuterDiameter - p.innerDiameter) / 2,
    toothRadialLength: (p.outerDiameter - p.bodyOuterDiameter) / 2,
    angularPitchDeg: 360 / p.teeth,
    toothTipAxialDeflection,
    envelopeHeight: effectiveHeight,
    bottomZ: 0,
    topZ: effectiveHeight,
  }
}
