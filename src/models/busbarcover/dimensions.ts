import {
  type BusbarCoverModelPropsInput,
  busbarCoverModelPropsSchema,
} from "./schema"

export function getBusbarCoverDimensions(
  input: BusbarCoverModelPropsInput = {},
) {
  const p = busbarCoverModelPropsSchema.parse(input)
  const outerWidth = p.innerWidth + 2 * p.thickness
  const outerHeight = p.innerHeight + p.thickness
  const entrySlotWidth = p.innerWidth - 2 * p.lipWidth
  return {
    ...p,
    outerWidth,
    outerHeight,
    entrySlotWidth,
    bottomZ: 0,
    topZ: outerHeight,
  }
}
