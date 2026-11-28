import {
  type PushbuttonBoxModelPropsInput,
  pushbuttonBoxModelPropsSchema,
} from "./schema"

export function getPushbuttonBoxDimensions(
  input: PushbuttonBoxModelPropsInput = {},
) {
  const p = pushbuttonBoxModelPropsSchema.parse(input)
  const innerWidth = p.width - 2 * p.wallThickness
  const innerDepth = p.depth - 2 * p.wallThickness
  const baseHeight = p.height - p.lidThickness
  return {
    ...p,
    innerWidth,
    innerDepth,
    baseHeight,
    bottomZ: 0,
    topZ: p.height,
  }
}
