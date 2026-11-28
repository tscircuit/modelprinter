import {
  type MicroswitchModelPropsInput,
  microswitchModelPropsSchema,
} from "./schema"

export function getMicroswitchDimensions(
  input: MicroswitchModelPropsInput = {},
) {
  const p = microswitchModelPropsSchema.parse(input)
  const overallSpanX = Math.max(p.width, p.leverLength)
  return {
    ...p,
    overallSpanX,
    bottomZ: 0,
    topZ: p.height,
  }
}
