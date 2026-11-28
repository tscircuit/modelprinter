import type { z } from "zod"

export interface EdgeClipShape {
  width: number
  length: number
  stripThickness: number
  panelGap: number
  barbs: number
  barbLength: number
  barbHeight: number
  uForm: true
}

export function validateEdgeClipProps(
  p: EdgeClipShape,
  ctx: z.RefinementCtx,
): void {
  if (2 * p.barbHeight >= p.panelGap) {
    ctx.addIssue({
      code: "custom",
      path: ["barbHeight"],
      message: "Opposed inward barbs close off sheet-metal entry gap",
    })
  }
  if (p.barbLength >= p.length / 2 || 2 * p.stripThickness >= p.width / 2) {
    ctx.addIssue({
      code: "custom",
      path: ["barbLength"],
      message: "Barb length or strip thickness exceeds edge-clip leg geometry",
    })
  }
}
