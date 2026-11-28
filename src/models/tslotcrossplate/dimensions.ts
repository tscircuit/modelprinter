import {
  type TSlotCrossPlateModelPropsInput,
  tSlotCrossPlateModelPropsSchema,
} from "./schema"

export function getTSlotCrossPlateDimensions(
  input: TSlotCrossPlateModelPropsInput = {},
) {
  const p = tSlotCrossPlateModelPropsSchema.parse(input)
  return {
    ...p,
    armProjectionX: (p.width - p.armWidth) / 2,
    armProjectionY: (p.height - p.armWidth) / 2,
    bottomZ: 0,
    topZ: p.thickness,
  }
}
