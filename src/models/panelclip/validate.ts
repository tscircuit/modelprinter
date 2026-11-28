import type { z } from "zod"

export interface PanelClipShape {
  width: number
  length: number
  stripThickness: number
  panelGap: number
  legs: number
  barbs: number
  barbLength: number
  barbHeight: number
  uForm: true
}

export function validatePanelClipProps(
  p: PanelClipShape,
  ctx: z.RefinementCtx,
): void {
  if (p.barbHeight >= p.panelGap || p.barbLength >= p.length / 2) {
    ctx.addIssue({
      code: "custom",
      path: ["barbHeight"],
      message:
        "Outward retention barb dimensions exceed U-clip leg proportions",
    })
  }
  if (2 * p.stripThickness >= p.width / 2) {
    ctx.addIssue({
      code: "custom",
      path: ["stripThickness"],
      message: "Spring strip thickness exceeds clip leg width",
    })
  }
}
