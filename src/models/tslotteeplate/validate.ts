import type { z } from "zod"

export interface TSlotTeePlateShape {
  width: number
  height: number
  armWidth: number
  thickness: number
  holes: number
  holeDiameter: number
  holePitch: number
  teeShape: true
}

export function validateTSlotTeePlateProps(
  p: TSlotTeePlateShape,
  ctx: z.RefinementCtx,
): void {
  if (p.armWidth >= p.width / 2 || p.armWidth >= p.height - 10) {
    ctx.addIssue({
      code: "custom",
      path: ["armWidth"],
      message: "T-plate arm width eliminates stepped T profile",
    })
  }
  if (p.holeDiameter >= p.armWidth - 6) {
    ctx.addIssue({
      code: "custom",
      path: ["holeDiameter"],
      message: "Bolt hole diameter leaves insufficient arm edge margin",
    })
  }
  if (2 * p.holePitch > p.width - p.holeDiameter - 4) {
    ctx.addIssue({
      code: "custom",
      path: ["holePitch"],
      message: "Outer crossbar holes break through T-plate ends",
    })
  }
}
