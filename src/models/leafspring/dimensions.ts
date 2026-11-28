import {
  type LeafSpringModelPropsInput,
  leafSpringModelPropsSchema,
} from "./schema"

export function getLeafSpringDimensions(input: LeafSpringModelPropsInput = {}) {
  const p = leafSpringModelPropsSchema.parse(input)
  const includedAngleRad = p.arcLength / p.radius
  const chordSpan = 2 * p.radius * Math.sin(includedAngleRad / 2)
  const camberHeight = p.radius * (1 - Math.cos(includedAngleRad / 2))
  return {
    ...p,
    includedAngleRad,
    chordSpan,
    camberHeight,
    bottomZ: 0,
    topZ: camberHeight + p.thickness,
  }
}
