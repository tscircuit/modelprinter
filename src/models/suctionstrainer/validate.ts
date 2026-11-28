import type { z } from "zod"

export interface SuctionStrainerShape {
  portNominal: number
  outerDiameter: number
  length: number
  perforationDiameter: number
  perforationPitch: number
  cylindrical: boolean
  flatCap: boolean
}

export function validateSuctionStrainerProps(
  p: SuctionStrainerShape,
  ctx: z.RefinementCtx,
): void {
  if (p.perforationDiameter >= p.perforationPitch - 0.5) {
    ctx.addIssue({
      code: "custom",
      path: ["perforationDiameter"],
      message: "Perforation hole diameter leaves insufficient screen ligament",
    })
  }
  if (p.portNominal >= p.outerDiameter - 6) {
    ctx.addIssue({
      code: "custom",
      path: ["portNominal"],
      message: "Threaded neck nominal bore exceeds strainer cage diameter",
    })
  }
}
