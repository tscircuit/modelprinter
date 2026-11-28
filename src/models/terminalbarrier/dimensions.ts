import {
  type TerminalBarrierModelPropsInput,
  terminalBarrierModelPropsSchema,
} from "./schema"

export function getTerminalBarrierDimensions(
  input: TerminalBarrierModelPropsInput = {},
) {
  const p = terminalBarrierModelPropsSchema.parse(input)
  const screwMajorDiameter = Number(p.screwThread.slice(1))
  const cellWidth = p.pitch - p.barrierThickness
  const activeBarrierSpan = p.poles * p.pitch + p.barrierThickness
  return {
    ...p,
    screwMajorDiameter,
    cellWidth,
    activeBarrierSpan,
    bottomZ: 0,
    topZ: p.height,
  }
}
