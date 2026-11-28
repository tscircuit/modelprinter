import type { z } from "zod"

export interface GuardPanelClampShape {
  width: number
  height: number
  parts: number
  partThickness: number
  grooveWidth: number
  grooveDepth: number
  holes: number
  holeDiameter: number
  holePitch: number
  widthGroove: true
}

export function validateGuardPanelClampProps(
  p: GuardPanelClampShape,
  ctx: z.RefinementCtx,
): void {
  if (p.grooveDepth >= p.partThickness - 2 || p.grooveWidth >= p.height - 6) {
    ctx.addIssue({
      code: "custom",
      path: ["grooveDepth"],
      message: "Wire-mesh clamping groove weakens split jaw block",
    })
  }
  if (p.holePitch > p.width - p.holeDiameter - 4) {
    ctx.addIssue({
      code: "custom",
      path: ["holePitch"],
      message: "Clamping bolt holes break through jaw side faces",
    })
  }
}
