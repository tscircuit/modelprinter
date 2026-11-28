import {
  type TerminalJumperModelPropsInput,
  terminalJumperModelPropsSchema,
} from "./schema"

export function getTerminalJumperDimensions(
  input: TerminalJumperModelPropsInput = {},
) {
  const p = terminalJumperModelPropsSchema.parse(input)
  const overallLength = (p.poles - 1) * p.pitch + p.prongWidth
  const overallHeight = p.stripWidth + p.prongLength
  return {
    ...p,
    overallLength,
    overallHeight,
    bottomZ: -p.prongLength,
    topZ: p.stripWidth,
  }
}
