import {
  type WedgeAnchorModelPropsInput,
  wedgeAnchorModelPropsSchema,
} from "./schema"

export function getWedgeAnchorDimensions(
  input: WedgeAnchorModelPropsInput = {},
) {
  const p = wedgeAnchorModelPropsSchema.parse(input)
  return {
    ...p,
    shankLength: p.length - p.threadLength - p.clipLength - p.coneLength,
    coneEndZ: 0,
    studTipZ: p.length,
  }
}
