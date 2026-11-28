import type { z } from "zod"

export interface TerminalCoverShape {
  width: number
  depth: number
  height: number
  thickness: number
  uHood: true
  footWidth: number
  holes: number
  holeDiameter: number
  holePitch: number
}

export function validateTerminalCoverProps(
  p: TerminalCoverShape,
  ctx: z.RefinementCtx,
): void {
  if (
    2 * p.thickness >= Math.min(p.width, p.depth) ||
    p.thickness >= p.height
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["thickness"],
      message: "Hood wall thickness exceeds cover width, depth, or height",
    })
  }
  if (p.holePitch + p.holeDiameter >= p.width) {
    ctx.addIssue({
      code: "custom",
      path: ["holePitch"],
      message: "Mounting hole pitch plus hole diameter exceeds hood width",
    })
  }
  if (p.holeDiameter >= 2 * p.footWidth) {
    ctx.addIssue({
      code: "custom",
      path: ["holeDiameter"],
      message: "Mounting hole diameter exceeds outward foot flange width",
    })
  }
}
