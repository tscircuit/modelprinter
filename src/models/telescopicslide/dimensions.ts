import {
  type TelescopicSlideModelPropsInput,
  telescopicSlideModelPropsSchema,
} from "./schema"

export function getTelescopicSlideDimensions(
  input: TelescopicSlideModelPropsInput = {},
) {
  const p = telescopicSlideModelPropsSchema.parse(input)
  const holeCountPerRail = Math.floor((p.length - 20) / p.holePitch) + 1
  return {
    ...p,
    holeCountPerRail,
    bottomZ: 0,
    topZ: p.width,
  }
}
