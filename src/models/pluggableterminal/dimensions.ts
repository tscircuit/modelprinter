import {
  type PluggableTerminalModelPropsInput,
  pluggableTerminalModelPropsSchema,
} from "./schema"

export function getPluggableTerminalDimensions(
  input: PluggableTerminalModelPropsInput = {},
) {
  const p = pluggableTerminalModelPropsSchema.parse(input)
  const contactSpan = (p.poles - 1) * p.pitch
  return {
    ...p,
    contactSpan,
    bottomZ: 0,
    topZ: p.height,
  }
}
