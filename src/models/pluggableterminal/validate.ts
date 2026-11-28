import type { z } from "zod"

export interface PluggableTerminalShape {
  pitch: number
  poles: number
  width: number
  height: number
  depth: number
  screwThread: string
  frontWire: true
  bottomFemale: true
}

export function validatePluggableTerminalProps(
  p: PluggableTerminalShape,
  ctx: z.RefinementCtx,
): void {
  const screwMajor = Number(p.screwThread.slice(1))
  if (screwMajor >= p.pitch - 1) {
    ctx.addIssue({
      code: "custom",
      path: ["screwThread"],
      message: "Cage clamp screw diameter exceeds pole pitch",
    })
  }
  const minWidth = (p.poles - 1) * p.pitch + screwMajor
  if (p.width < minWidth) {
    ctx.addIssue({
      code: "custom",
      path: ["width"],
      message: "Housing width cannot contain all terminal positions",
    })
  }
}
