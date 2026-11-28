import {
  type SnapButtonModelPropsInput,
  snapButtonModelPropsSchema,
} from "./schema"

export function getSnapButtonDimensions(input: SnapButtonModelPropsInput = {}) {
  const p = snapButtonModelPropsSchema.parse(input)
  return {
    ...p,
    freeSpreadHeight: 2 * p.legLength * Math.sin((p.legAngle * Math.PI) / 360),
    buttonTipZ: p.buttonHeight,
  }
}
