import type { z } from "zod"

export interface MultiGrommetShape {
  outerDiameter: number
  height: number
  panelHoleDiameter: number
  grooveWidth: number
  bores: number
  boreInnerDiameter: number
  borePcd: number
}

export function validateMultiGrommetProps(
  p: MultiGrommetShape,
  ctx: z.RefinementCtx,
): void {
  if (p.panelHoleDiameter >= p.outerDiameter - 2) {
    ctx.addIssue({
      code: "custom",
      path: ["panelHoleDiameter"],
      message:
        "Panel groove root diameter must be smaller than outer flange OD",
    })
  }
  if (p.grooveWidth >= p.height - 2) {
    ctx.addIssue({
      code: "custom",
      path: ["grooveWidth"],
      message: "Panel groove width leaves insufficient retaining lip thickness",
    })
  }
  if (p.borePcd + p.boreInnerDiameter >= p.panelHoleDiameter - 2) {
    ctx.addIssue({
      code: "custom",
      path: ["borePcd"],
      message: "Cable bore circle encroaches on outer panel groove root",
    })
  }
  if (Math.sin(Math.PI / p.bores) * p.borePcd <= p.boreInnerDiameter + 0.5) {
    ctx.addIssue({
      code: "custom",
      path: ["bores"],
      message: "Adjacent cable bores overlap on the pitch circle",
    })
  }
}
