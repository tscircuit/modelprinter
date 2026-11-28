import type { z } from "zod"

export interface BusbarSupportShape {
  width: number
  depth: number
  height: number
  seatWidth: number
  seatDepth: number
  flangeThickness: number
  holes: 2
  holeDiameter: number
  holePitch: number
  saddle: true
}

export function validateBusbarSupportProps(
  p: BusbarSupportShape,
  ctx: z.RefinementCtx,
): void {
  if (p.seatWidth >= p.width - 4) {
    ctx.addIssue({
      code: "custom",
      path: ["seatWidth"],
      message: "Busbar saddle slot width exceeds pedestal cheek walls",
    })
  }
  if (p.seatDepth >= p.height - p.flangeThickness) {
    ctx.addIssue({
      code: "custom",
      path: ["seatDepth"],
      message: "Busbar saddle depth cuts into lower mounting flange",
    })
  }
  if (p.holePitch + p.holeDiameter >= p.width) {
    ctx.addIssue({
      code: "custom",
      path: ["holePitch"],
      message: "Mounting foot hole pitch exceeds pedestal width",
    })
  }
}
