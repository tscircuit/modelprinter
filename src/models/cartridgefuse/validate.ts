import type { z } from "zod"

export interface CartridgeFuseShape {
  cartridge5x20: true
  outerDiameter: number
  length: number
  capLength: number
  ceramicCylinder: true
}

export function validateCartridgeFuseProps(
  p: CartridgeFuseShape,
  ctx: z.RefinementCtx,
): void {
  if (2 * p.capLength >= p.length - 2) {
    ctx.addIssue({
      code: "custom",
      path: ["capLength"],
      message: "End caps must leave an exposed central insulating gap",
    })
  }
}
