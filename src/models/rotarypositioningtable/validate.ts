import type { z } from "zod"

export interface RotaryPositioningTableShape {
  outerDiameter: number
  height: number
  boreDiameter: number
  tableBoltPcd: number
  baseBoltPcd: number
  holeDiameter: number
  tableThreadDiameter: number
  baseHoles: number
}

export function validateRotaryPositioningTableProps(
  p: RotaryPositioningTableShape,
  ctx: z.RefinementCtx,
): void {
  if (p.boreDiameter >= p.tableBoltPcd - p.tableThreadDiameter - 4) {
    ctx.addIssue({
      code: "custom",
      path: ["boreDiameter"],
      message: "Central hollow bore intersects turntable bolt circle",
    })
  }
  if (
    p.baseBoltPcd + p.holeDiameter > p.outerDiameter - 3 ||
    p.tableBoltPcd + p.tableThreadDiameter > p.outerDiameter - 4
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["baseBoltPcd"],
      message: "Bolt circle exceeds stage outer diameter",
    })
  }
}
