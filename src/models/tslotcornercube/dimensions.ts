import {
  type TSlotCornerCubeModelPropsInput,
  tSlotCornerCubeModelPropsSchema,
} from "./schema"

export function getTSlotCornerCubeDimensions(
  input: TSlotCornerCubeModelPropsInput = {},
) {
  const p = tSlotCornerCubeModelPropsSchema.parse(input)
  return {
    ...p,
    minWallMargin:
      (Math.min(p.width, p.height, p.depth) - p.counterboreDiameter) / 2,
    bottomZ: -p.height / 2,
    topZ: p.height / 2,
  }
}
