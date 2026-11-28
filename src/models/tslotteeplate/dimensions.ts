import {
  type TSlotTeePlateModelPropsInput,
  tSlotTeePlateModelPropsSchema,
} from "./schema"

export function getTSlotTeePlateDimensions(
  input: TSlotTeePlateModelPropsInput = {},
) {
  const p = tSlotTeePlateModelPropsSchema.parse(input)
  return {
    ...p,
    stemLength: p.height - p.armWidth,
    bottomZ: 0,
    topZ: p.thickness,
  }
}
