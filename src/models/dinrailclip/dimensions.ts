import {
  type DinRailClipModelPropsInput,
  dinRailClipModelPropsSchema,
} from "./schema"

export function getDinRailClipDimensions(
  input: DinRailClipModelPropsInput = {},
) {
  const p = dinRailClipModelPropsSchema.parse(input)
  return {
    ...p,
    dinRailWidth: 35,
    bottomZ: 0,
    topZ: p.height,
  }
}
