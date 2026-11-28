import {
  type ShelfSupportClipModelPropsInput,
  shelfSupportClipModelPropsSchema,
} from "./schema"

export function getShelfSupportClipDimensions(
  input: ShelfSupportClipModelPropsInput = {},
) {
  const p = shelfSupportClipModelPropsSchema.parse(input)
  return {
    ...p,
    overallDepth: p.ledgeLength + p.hookDepth + p.thickness,
    rearHookX: -p.hookDepth,
    frontLedgeX: p.ledgeLength,
  }
}
