import type { z } from "zod"

export interface VBeltShape {
  length: number
  topWidth: number
  height: number
  customV: true
  sideAngle: number
  endless: true
}

export function validateVBeltProps(p: VBeltShape, ctx: z.RefinementCtx): void {
  const bottomWidth =
    p.topWidth - 2 * p.height * Math.tan((p.sideAngle * Math.PI) / 360)
  if (bottomWidth <= 1) {
    ctx.addIssue({
      code: "custom",
      path: ["height"],
      message: "Trapezoidal V-belt flank taper collapses bottom width <= 1 mm",
    })
  }
  if (p.length <= Math.PI * p.height * 8) {
    ctx.addIssue({
      code: "custom",
      path: ["length"],
      message:
        "Endless V-belt loop length is too short for minimum bend radius",
    })
  }
}
