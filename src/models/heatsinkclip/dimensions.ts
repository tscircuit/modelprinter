import {
  type HeatsinkClipModelPropsInput,
  heatsinkClipModelPropsSchema,
} from "./schema"

export function getHeatsinkClipDimensions(
  input: HeatsinkClipModelPropsInput = {},
) {
  const p = heatsinkClipModelPropsSchema.parse(input)
  return {
    ...p,
    archDeflectionClearance: p.height - p.hookDepth - p.stripThickness,
    hookBottomZ: 0,
    archTopZ: p.height,
  }
}
