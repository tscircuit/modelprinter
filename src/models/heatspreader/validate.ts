import type { z } from "zod"

export interface HeatSpreaderShape {
  width: number
  length: number
  thickness: number
  bossWidth: number
  bossLength: number
  bossHeight: number
  holes: 4
  holeDiameter: number
  countersinkDiameter: number
  holePitchX: number
  holePitchY: number
}

export function validateHeatSpreaderProps(
  p: HeatSpreaderShape,
  ctx: z.RefinementCtx,
): void {
  if (p.countersinkDiameter <= p.holeDiameter) {
    ctx.addIssue({
      code: "custom",
      path: ["countersinkDiameter"],
      message: "Countersink diameter must exceed clearance hole diameter",
    })
  }
  if (
    p.bossWidth >= p.holePitchX - p.countersinkDiameter ||
    p.bossLength >= p.holePitchY - p.countersinkDiameter
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["bossWidth"],
      message: "Central raised contact boss collides with corner countersinks",
    })
  }
  if (
    p.holePitchX + p.countersinkDiameter >= p.width ||
    p.holePitchY + p.countersinkDiameter >= p.length
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["holePitchX"],
      message: "Countersunk corner holes exceed spreader plate footprint",
    })
  }
}
