import type { z } from "zod"

export interface RodWiperSealShape {
  rodOuterDiameter: number
  outerDiameter: number
  height: number
  singleLip: true
  inwardLip: true
  bodyInnerDiameter: number
  lipThickness: number
  baseThickness: number
}

export function validateRodWiperSealProps(
  p: RodWiperSealShape,
  ctx: z.RefinementCtx,
): void {
  if (p.bodyInnerDiameter <= p.rodOuterDiameter) {
    ctx.addIssue({
      code: "custom",
      path: ["bodyInnerDiameter"],
      message: "Heel body ID must exceed wiper lip rod contact diameter",
    })
  }
  if (p.bodyInnerDiameter >= p.outerDiameter - 2) {
    ctx.addIssue({
      code: "custom",
      path: ["outerDiameter"],
      message: "Outer diameter must leave positive gland press-fit base wall",
    })
  }
  if (p.baseThickness >= p.height) {
    ctx.addIssue({
      code: "custom",
      path: ["baseThickness"],
      message: "Heel base thickness must leave projecting scraper lip height",
    })
  }
}
