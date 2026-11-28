import type { z } from "zod"

export interface ShelfPostShape {
  outerDiameter: number
  wallThickness: number
  length: number
  groovePitch: number
  grooveWidth: number
  grooveDepth: number
  firstGrooveZ: number
}

export function validateShelfPostProps(
  p: ShelfPostShape,
  ctx: z.RefinementCtx,
): void {
  if (2 * p.wallThickness >= p.outerDiameter - 4) {
    ctx.addIssue({
      code: "custom",
      path: ["wallThickness"],
      message: "Tube wall thickness closes off hollow shelving post",
    })
  }
  if (p.grooveDepth >= p.wallThickness * 0.85) {
    ctx.addIssue({
      code: "custom",
      path: ["grooveDepth"],
      message: "Annular groove depth cuts through post tube wall",
    })
  }
  if (p.grooveWidth >= p.groovePitch - 2) {
    ctx.addIssue({
      code: "custom",
      path: ["grooveWidth"],
      message: "Annular groove width exceeds groove pitch",
    })
  }
  if (p.firstGrooveZ <= p.grooveWidth || p.firstGrooveZ >= p.length) {
    ctx.addIssue({
      code: "custom",
      path: ["firstGrooveZ"],
      message: "First groove offset lies outside post length",
    })
  }
}
