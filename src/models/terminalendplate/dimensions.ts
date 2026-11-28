import {
  type TerminalEndPlateModelPropsInput,
  terminalEndPlateModelPropsSchema,
} from "./schema"

export function getTerminalEndPlateDimensions(
  input: TerminalEndPlateModelPropsInput = {},
) {
  const p = terminalEndPlateModelPropsSchema.parse(input)
  return {
    ...p,
    dinRailWidth: 35,
    bottomZ: 0,
    topZ: p.height,
  }
}
