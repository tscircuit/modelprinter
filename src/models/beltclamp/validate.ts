import type { z } from "zod"

export interface BeltClampShape {
  width: number
  length: number
  height: number
  pitch: number
  htd5m: true
  base2Hole: true
  holeDiameter: number
  holePitch: number
}

export function validateBeltClampProps(
  p: BeltClampShape,
  ctx: z.RefinementCtx,
): void {
  if (Math.abs(p.pitch - 5) > 1e-6) {
    ctx.addIssue({
      code: "custom",
      path: ["pitch"],
      message: "HTD 5M belt clamp requires a 5 mm tooth pitch",
    })
  }
  if (p.length < p.pitch * 2) {
    ctx.addIssue({
      code: "custom",
      path: ["length"],
      message: "Clamp block length must engage at least two belt pitches",
    })
  }
  if (p.holePitch + p.holeDiameter >= p.length) {
    ctx.addIssue({
      code: "custom",
      path: ["holePitch"],
      message: "Base mounting hole pitch exceeds clamp block length",
    })
  }
  if (p.holeDiameter >= p.width - 2) {
    ctx.addIssue({
      code: "custom",
      path: ["holeDiameter"],
      message: "Base mounting hole diameter exceeds clamp block width",
    })
  }
}
