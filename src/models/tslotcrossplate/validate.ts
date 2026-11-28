import type { z } from "zod"

export interface TSlotCrossPlateShape {
  width: number
  height: number
  armWidth: number
  thickness: number
  holes: number
  holeDiameter: number
  holePitch: number
  crossShape: true
}

export function validateTSlotCrossPlateProps(
  p: TSlotCrossPlateShape,
  ctx: z.RefinementCtx,
): void {
  const minSpan = Math.min(p.width, p.height)
  if (p.armWidth >= minSpan / 2) {
    ctx.addIssue({
      code: "custom",
      path: ["armWidth"],
      message: "Cross plate arm width eliminates four-arm cruciform profile",
    })
  }
  if (p.holeDiameter >= p.armWidth - 6) {
    ctx.addIssue({
      code: "custom",
      path: ["holeDiameter"],
      message: "Fastener hole diameter exceeds cross arm width margin",
    })
  }
  if (2 * p.holePitch > minSpan - p.holeDiameter - 4) {
    ctx.addIssue({
      code: "custom",
      path: ["holePitch"],
      message: "Outer arm holes break through cross plate tips",
    })
  }
}
