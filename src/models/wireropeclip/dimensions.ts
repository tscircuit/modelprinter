import {
  type WireRopeClipModelPropsInput,
  wireRopeClipModelPropsSchema,
} from "./schema"

export function getWireRopeClipDimensions(
  input: WireRopeClipModelPropsInput = {},
) {
  const p = wireRopeClipModelPropsSchema.parse(input)
  return {
    ...p,
    clearBetweenLegs: p.legPitch - p.uBoltDiameter,
    ropeAxisZ: 0,
  }
}
