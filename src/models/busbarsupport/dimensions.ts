import {
  type BusbarSupportModelPropsInput,
  busbarSupportModelPropsSchema,
} from "./schema"

export function getBusbarSupportDimensions(
  input: BusbarSupportModelPropsInput = {},
) {
  const p = busbarSupportModelPropsSchema.parse(input)
  const seatFloorZ = p.height - p.seatDepth
  return {
    ...p,
    seatFloorZ,
    bottomZ: 0,
    topZ: p.height,
  }
}
