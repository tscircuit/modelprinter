import type { z } from "zod"

export interface FanMountFrameShape {
  width: number
  height: number
  depth: number
  wallThickness: number
  openingDiameter: number
  bossHeight: number
  fanHoleDiameter: number
  holePitchX: number
  holePitchY: number
  ears: 2
  mountHoleDiameter: number
  earHolePitch: number
  earWidth: number
  earLength: number
}

export function validateFanMountFrameProps(
  p: FanMountFrameShape,
  ctx: z.RefinementCtx,
): void {
  if (p.openingDiameter >= Math.min(p.width, p.height) - 2 * p.wallThickness) {
    ctx.addIssue({
      code: "custom",
      path: ["openingDiameter"],
      message: "Circular fan aperture exceeds inner frame perimeter walls",
    })
  }
  if (p.earHolePitch <= p.width) {
    ctx.addIssue({
      code: "custom",
      path: ["earHolePitch"],
      message: "Outer ear hole pitch must exceed square frame width",
    })
  }
  if (p.earHolePitch + p.mountHoleDiameter >= p.width + 2 * p.earLength) {
    ctx.addIssue({
      code: "custom",
      path: ["earHolePitch"],
      message: "Outer ear mounting hole exceeds projecting ear length",
    })
  }
}
