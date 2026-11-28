import type { z } from "zod"

export interface PipeBlindFlangeShape {
  outerDiameter: number
  thickness: number
  boltCircleDiameter: number
  holes: number
  holeDiameter: number
  flatFace: true
  solidCenter: true
}

export function validatePipeBlindFlangeProps(
  p: PipeBlindFlangeShape,
  ctx: z.RefinementCtx,
): void {
  if (p.boltCircleDiameter + p.holeDiameter >= p.outerDiameter - 4) {
    ctx.addIssue({
      code: "custom",
      path: ["boltCircleDiameter"],
      message: "Bolt holes break through blind flange outer rim",
    })
  }
  if (p.boltCircleDiameter <= 2 * p.holeDiameter) {
    ctx.addIssue({
      code: "custom",
      path: ["boltCircleDiameter"],
      message: "Bolt circle diameter collapses onto solid flange center",
    })
  }
}
