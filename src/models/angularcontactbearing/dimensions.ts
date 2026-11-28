import {
  type AngularContactBearingModelPropsInput,
  angularContactBearingModelPropsSchema,
} from "./schema"

export function getAngularContactBearingDimensions(
  input: AngularContactBearingModelPropsInput = {},
) {
  const p = angularContactBearingModelPropsSchema.parse(input)
  const pitchDiameter = (p.innerDiameter + p.outerDiameter) / 2
  const loadCenterOffset =
    (pitchDiameter / 2) * Math.tan((p.contactAngle * Math.PI) / 180)
  return {
    ...p,
    pitchDiameter,
    loadCenterOffset,
    bottomZ: 0,
    topZ: p.width,
  }
}
