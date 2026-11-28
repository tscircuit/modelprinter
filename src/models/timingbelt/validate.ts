import type { z } from "zod"

export interface TimingBeltShape {
  pitch: number
  teeth: number
  width: number
  beltHeight: number
  htd5m: true
  pitchLength: number
  endless: true
}

export function validateTimingBeltProps(
  p: TimingBeltShape,
  ctx: z.RefinementCtx,
): void {
  if (Math.abs(p.pitch - 5) > 1e-6) {
    ctx.addIssue({
      code: "custom",
      path: ["pitch"],
      message: "HTD 5M belt profile requires a 5 mm tooth pitch",
    })
  }
  if (Math.abs(p.teeth * p.pitch - p.pitchLength) > 1e-4) {
    ctx.addIssue({
      code: "custom",
      path: ["pitchLength"],
      message: `Pitch length ${p.pitchLength} mm must equal teeth * pitch (${p.teeth * p.pitch} mm)`,
    })
  }
  if (p.beltHeight <= 2.06) {
    ctx.addIssue({
      code: "custom",
      path: ["beltHeight"],
      message: "HTD 5M belt height must exceed 2.06 mm tooth height",
    })
  }
}
