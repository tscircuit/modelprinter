import type { z } from "zod"

export interface DinRailShape {
  en60715Th35x75: true
  width: number
  height: number
  length: number
  sheetThickness: number
  baseWidth: number
  lipWidth: number
  topHat: true
  unslotted: boolean
}

export function validateDinRailProps(
  p: DinRailShape,
  ctx: z.RefinementCtx,
): void {
  if (Math.abs(p.baseWidth + 2 * p.lipWidth - p.width) > 1e-6) {
    ctx.addIssue({
      code: "custom",
      path: ["baseWidth"],
      message:
        "Top-hat DIN rail requires baseWidth + 2 * lipWidth to equal overall width",
    })
  }
  if (p.sheetThickness * 2 >= p.height) {
    ctx.addIssue({
      code: "custom",
      path: ["sheetThickness"],
      message: "Formed sheet thickness must leave inner channel height",
    })
  }
  if (p.sheetThickness * 2 >= p.baseWidth) {
    ctx.addIssue({
      code: "custom",
      path: ["sheetThickness"],
      message: "Formed sheet thickness must leave inner web clearance",
    })
  }
}
