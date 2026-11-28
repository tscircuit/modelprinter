import {
  type LAnchorBoltModelPropsInput,
  lAnchorBoltModelPropsSchema,
} from "./schema"

export function getLAnchorBoltDimensions(
  input: LAnchorBoltModelPropsInput = {},
) {
  const p = lAnchorBoltModelPropsSchema.parse(input)
  return {
    ...p,
    straightVerticalShank: p.length - p.threadLength - p.bendRadius,
    bottomZ: 0,
    topZ: p.length,
  }
}
