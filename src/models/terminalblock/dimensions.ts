import {
  type TerminalBlockModelPropsInput,
  terminalBlockModelPropsSchema,
} from "./schema"

export function getTerminalBlockDimensions(
  input: TerminalBlockModelPropsInput,
) {
  const p = terminalBlockModelPropsSchema.parse(input)
  const pinSpan = (p.positions - 1) * p.pitch
  const firstPinX = -pinSpan / 2
  const pinPositionsX = Array.from(
    { length: p.positions },
    (_, index) => firstPinX + index * p.pitch,
  )
  const screwNominalDiameter = Number(p.screwThread.slice(1))
  const endMargin = (p.width - pinSpan) / 2
  return {
    ...p,
    pinSpan,
    firstPinX,
    pinPositionsX,
    screwNominalDiameter,
    endMargin,
    bottomZ: -p.tailLength,
    seatZ: 0,
    topZ: p.height,
  }
}
