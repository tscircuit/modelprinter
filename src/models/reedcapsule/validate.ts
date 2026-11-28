import type { z } from "zod"

export interface ReedCapsuleShape {
  outerDiameter: number
  bodyLength: number
  leadOuterDiameter: number
  leadLength: number
  axialGlass: true
  contacts: 2
  throughHole: true
}

export function validateReedCapsuleProps(
  p: ReedCapsuleShape,
  ctx: z.RefinementCtx,
): void {
  if (p.leadOuterDiameter >= p.outerDiameter * 0.5) {
    ctx.addIssue({
      code: "custom",
      path: ["leadOuterDiameter"],
      message: "Axial wire lead diameter exceeds glass seal pinch capacity",
    })
  }
}
