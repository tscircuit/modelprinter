import type { z } from "zod"

export interface VaporChamberShape {
  width: number
  length: number
  height: number
  cornerRadius: number
  tabs: 4
  tabWidth: number
  holeDiameter: number
  holePitchX: number
  holePitchY: number
}

export function validateVaporChamberProps(
  p: VaporChamberShape,
  ctx: z.RefinementCtx,
): void {
  if (2 * p.cornerRadius >= Math.min(p.width, p.length) * 0.5) {
    ctx.addIssue({
      code: "custom",
      path: ["cornerRadius"],
      message: "Corner radius exceeds vapor chamber perimeter bounds",
    })
  }
  if (p.holeDiameter >= p.tabWidth - 2) {
    ctx.addIssue({
      code: "custom",
      path: ["holeDiameter"],
      message: "Mounting hole diameter exceeds outward fixing tab width",
    })
  }
  if (p.holePitchX <= p.width) {
    ctx.addIssue({
      code: "custom",
      path: ["holePitchX"],
      message: "Outward side tab hole pitch X must exceed chamber body width",
    })
  }
}
