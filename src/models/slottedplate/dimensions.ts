import {
  type SlottedPlateModelPropsInput,
  slottedPlateModelPropsSchema,
} from "./schema"

export function getSlottedPlateDimensions(
  input: SlottedPlateModelPropsInput = {},
) {
  const p = slottedPlateModelPropsSchema.parse(input)
  const columns =
    Math.floor((p.length - 2 * p.edgeX - p.slotLength) / p.pitchX) + 1
  const rows = Math.floor((p.width - 2 * p.edgeY - p.slotWidth) / p.pitchY) + 1
  return {
    ...p,
    columns,
    rows,
    bottomZ: -p.thickness / 2,
    topZ: p.thickness / 2,
  }
}
