import type { z } from "zod"

export interface ShieldCanShape {
  width: number
  depth: number
  height: number
  wallThickness: number
  tabs: number
  tabWidth: number
  tabHeight: number
  topStyle: "closedtop" | "openframe"
}

export function validateShieldCanProps(
  p: ShieldCanShape,
  ctx: z.RefinementCtx,
): void {
  if (2 * p.wallThickness >= Math.min(p.width, p.depth) - 4) {
    ctx.addIssue({
      code: "custom",
      path: ["wallThickness"],
      message: "Shield wall thickness closes off interior RF cavity",
    })
  }
  if (p.wallThickness >= p.height - 1) {
    ctx.addIssue({
      code: "custom",
      path: ["wallThickness"],
      message: "Shield roof thickness exceeds can height",
    })
  }
  if (p.tabs % 2 !== 0) {
    ctx.addIssue({
      code: "custom",
      path: ["tabs"],
      message: "Perimeter solder tab count must be even",
    })
  }
  if (p.tabWidth >= Math.min(p.width, p.depth) / 2) {
    ctx.addIssue({
      code: "custom",
      path: ["tabWidth"],
      message: "Solder tab width exceeds perimeter wall span",
    })
  }
  if (p.tabHeight >= p.height) {
    ctx.addIssue({
      code: "custom",
      path: ["tabHeight"],
      message: "Solder tab height exceeds shield skirt height",
    })
  }
}
