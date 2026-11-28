import {
  type TSlotJoinPlateModelPropsInput,
  tSlotJoinPlateModelPropsSchema,
} from "./schema"

/** Resolved dimensions and margins in millimeters; mounting face is Z=0, top face is Z=thickness. */
export function getTSlotJoinPlateDimensions(
  input: TSlotJoinPlateModelPropsInput = {},
) {
  const props = tSlotJoinPlateModelPropsSchema.parse(input)
  const [slotWidth, slotLength] = props.slot
  const centerSpan = (props.slotCount - 1) * props.pitch
  const endMargin = (props.length - (centerSpan + slotLength)) * 0.5
  const sideMargin = (props.width - slotWidth) * 0.5
  const ligament = props.pitch - slotLength
  return {
    ...props,
    slotWidth,
    slotLength,
    centerSpan,
    firstSlotCenterX: -centerSpan * 0.5,
    lastSlotCenterX: centerSpan * 0.5,
    ligament,
    endMargin,
    sideMargin,
    size: [props.length, props.width, props.thickness] as [
      number,
      number,
      number,
    ],
    bottomZ: 0,
    topZ: props.thickness,
  }
}
