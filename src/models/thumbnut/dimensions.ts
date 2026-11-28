import {
  type ThumbNutModelPropsInput,
  thumbNutModelPropsSchema,
} from "./schema"

export function getThumbNutDimensions(input: ThumbNutModelPropsInput = {}) {
  const p = thumbNutModelPropsSchema.parse(input)
  return {
    ...p,
    knurlBandHeight: p.height - 2 * p.chamfer,
    bottomZ: 0,
    topZ: p.height,
  }
}
