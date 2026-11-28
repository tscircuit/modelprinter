import type { z } from "zod"

export interface TerminalBarrierShape {
  pitch: number
  poles: number
  width: number
  depth: number
  height: number
  screwThread: string
  barrierThickness: number
  holes: 2
  holeDiameter: number
  holePitch: number
}

export function validateTerminalBarrierProps(
  p: TerminalBarrierShape,
  ctx: z.RefinementCtx,
): void {
  const screwMajor = Number(p.screwThread.slice(1))
  if (p.barrierThickness + screwMajor >= p.pitch) {
    ctx.addIssue({
      code: "custom",
      path: ["barrierThickness"],
      message:
        "Barrier wall thickness leaves insufficient cell width for clamp screw",
    })
  }
  const requiredCoreWidth = p.poles * p.pitch + p.barrierThickness
  if (requiredCoreWidth > p.width) {
    ctx.addIssue({
      code: "custom",
      path: ["width"],
      message: "Overall width cannot fit all terminal poles and barrier walls",
    })
  }
  if (p.holePitch + p.holeDiameter >= p.width) {
    ctx.addIssue({
      code: "custom",
      path: ["holePitch"],
      message: "End mounting hole pitch exceeds barrier strip width",
    })
  }
}
