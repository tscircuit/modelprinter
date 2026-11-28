import type { z } from "zod"

export interface XRingShape {
  innerDiameter: number
  crossSectionDiameter: number
  quadrilobe: true
  lobes: 4
  lobeRadius: number
}

export function validateXRingProps(p: XRingShape, ctx: z.RefinementCtx): void {
  if (p.lobeRadius >= p.crossSectionDiameter / 2) {
    ctx.addIssue({
      code: "custom",
      path: ["lobeRadius"],
      message:
        "Quad-ring lobe radius must be less than half cross-section width",
    })
  }
}
