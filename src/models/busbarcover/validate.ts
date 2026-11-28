import type { z } from "zod"

export interface BusbarCoverShape {
  length: number
  innerWidth: number
  innerHeight: number
  thickness: number
  lipWidth: number
  inwardUChannel: true
}

export function validateBusbarCoverProps(
  p: BusbarCoverShape,
  ctx: z.RefinementCtx,
): void {
  if (2 * p.lipWidth >= p.innerWidth - 2) {
    ctx.addIssue({
      code: "custom",
      path: ["lipWidth"],
      message: "Inward snap retaining lips close off the lower entry slot",
    })
  }
}
