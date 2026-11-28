import {
  type ShelfPostModelPropsInput,
  shelfPostModelPropsSchema,
} from "./schema"

export function getShelfPostDimensions(input: ShelfPostModelPropsInput = {}) {
  const p = shelfPostModelPropsSchema.parse(input)
  const grooveCount =
    Math.floor((p.length - p.firstGrooveZ - p.grooveWidth) / p.groovePitch) + 1
  return {
    ...p,
    grooveCount,
    bottomZ: 0,
    topZ: p.length,
  }
}
