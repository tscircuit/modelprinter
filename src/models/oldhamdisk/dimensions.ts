import {
  type OldhamDiskModelPropsInput,
  oldhamDiskModelPropsSchema,
} from "./schema"

export function getOldhamDiskDimensions(input: OldhamDiskModelPropsInput = {}) {
  const p = oldhamDiskModelPropsSchema.parse(input)
  const webThickness = p.width - 2 * p.tongueHeight
  return {
    ...p,
    webThickness,
    bottomZ: -p.width / 2,
    topZ: p.width / 2,
  }
}
