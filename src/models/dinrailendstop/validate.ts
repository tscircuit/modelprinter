import type { z } from "zod"

export interface DinRailEndStopShape {
  th35x75: true
  width: number
  depth: number
  height: number
  clampThread: string
  jawGap: number
  screwClamp: true
}

export function validateDinRailEndStopProps(
  p: DinRailEndStopShape,
  ctx: z.RefinementCtx,
): void {
  if (p.depth < p.jawGap) {
    ctx.addIssue({
      code: "custom",
      path: ["depth"],
      message: "End-stop body depth must span the DIN rail jaw gap",
    })
  }
  if (Math.abs(p.jawGap - 35) > 2) {
    ctx.addIssue({
      code: "custom",
      path: ["jawGap"],
      message: "TH35x7.5 DIN rail end stop requires ~35 mm jaw gap",
    })
  }
}
