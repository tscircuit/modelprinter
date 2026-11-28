import {
  type TSlotJoinPlateModelPropsInput,
  tSlotJoinPlateModelPropsSchema,
} from "./schema"

/** Collinear slots pass through +Z along Y=0; orientation is 0 degrees (+X). */
export function getTSlotJoinPlateMountingSlots(
  input: TSlotJoinPlateModelPropsInput = {},
) {
  const props = tSlotJoinPlateModelPropsSchema.parse(input)
  const [slotWidth, slotLength] = props.slot
  const startX = -((props.slotCount - 1) * props.pitch) * 0.5
  return Array.from({ length: props.slotCount }, (_, index) => ({
    center: { x: startX + index * props.pitch, y: 0, z: 0 },
    orientation: 0 as const,
    width: slotWidth,
    length: slotLength,
    depth: props.thickness,
    direction: { x: 0, y: 0, z: 1 } as const,
  }))
}
