import type { z } from "zod"

export interface TerminalBlockInputShape {
  pitch: number
  positions: number
  width?: number
  depth: number
  height: number
  wireEntryDiameter: number
  screwThread: string
  throughHole: true
  tailLength: number
}

export function validateTerminalBlockProps(
  p: TerminalBlockInputShape,
  ctx: z.RefinementCtx,
): void {
  const effectiveWidth = p.width ?? p.positions * p.pitch
  const minRequiredWidth = (p.positions - 1) * p.pitch + p.wireEntryDiameter
  if (effectiveWidth <= minRequiredWidth) {
    ctx.addIssue({
      code: "custom",
      path: ["width"],
      message:
        "Terminal block width must exceed the outer wire-entry span across all positions",
    })
  }
  if (p.wireEntryDiameter >= p.pitch) {
    ctx.addIssue({
      code: "custom",
      path: ["wireEntryDiameter"],
      message: "Wire entry diameter must be smaller than terminal pitch",
    })
  }
  if (p.wireEntryDiameter >= p.height * 0.75) {
    ctx.addIssue({
      code: "custom",
      path: ["wireEntryDiameter"],
      message: "Wire entry diameter must fit inside the housing height",
    })
  }
  const screwDiameter = Number(p.screwThread.slice(1))
  if (
    !Number.isFinite(screwDiameter) ||
    screwDiameter <= 0 ||
    screwDiameter >= Math.min(p.pitch, p.depth * 0.8)
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["screwThread"],
      message:
        "Clamp screw nominal diameter must fit within terminal pitch and housing depth",
    })
  }
}
