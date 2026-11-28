import {
  type ThumbScrewModelPropsInput,
  thumbScrewModelPropsSchema,
} from "./schema"

export function getThumbScrewDimensions(input: ThumbScrewModelPropsInput = {}) {
  const p = thumbScrewModelPropsSchema.parse(input)
  const majorDiameter = Number(p.thread.slice(1))
  const knurlRidgeCount = Math.round(
    (Math.PI * p.headOuterDiameter) / p.knurlPitch,
  )
  const overallLength = p.length + p.headHeight
  return {
    ...p,
    majorDiameter,
    knurlRidgeCount,
    overallLength,
    bottomZ: -p.length,
    topZ: p.headHeight,
  }
}
