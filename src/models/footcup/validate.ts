import type { z } from "zod"

export interface FootCupShape {
  innerDiameter: number
  outerDiameter: number
  height: number
  floorThickness: number
  mounts: 2
  holeDiameter: number
  holePitch: number
}

export function validateFootCupProps(
  p: FootCupShape,
  ctx: z.RefinementCtx,
): void {
  if (p.innerDiameter >= p.outerDiameter - 2) {
    ctx.addIssue({
      code: "custom",
      path: ["innerDiameter"],
      message: "Seat pocket diameter leaves insufficient cup rim wall",
    })
  }
  if (p.floorThickness >= p.height - 1) {
    ctx.addIssue({
      code: "custom",
      path: ["floorThickness"],
      message: "Floor thickness eliminates recessed foot pocket depth",
    })
  }
  if (p.holePitch <= p.outerDiameter + p.holeDiameter) {
    ctx.addIssue({
      code: "custom",
      path: ["holePitch"],
      message: "Side mounting tab hole pitch must clear cup outer diameter",
    })
  }
}
