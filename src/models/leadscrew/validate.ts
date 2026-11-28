import type { z } from "zod"

export interface LeadScrewShape {
  diameter: number
  length: number
  trapezoidalThread: string
  threadPitch: number
  lead: number
  starts: number
  rightHanded: true
}

export function validateLeadScrewProps(
  p: LeadScrewShape,
  ctx: z.RefinementCtx,
): void {
  const nominalDiameter = Number(p.trapezoidalThread.slice(2))
  if (Math.abs(p.diameter - nominalDiameter) > 1e-6) {
    ctx.addIssue({
      code: "custom",
      path: ["diameter"],
      message: `Diameter ${p.diameter} mm must match trapezoidal designation ${p.trapezoidalThread} (${nominalDiameter} mm)`,
    })
  }
  if (Math.abs(p.lead - p.starts * p.threadPitch) > 1e-6) {
    ctx.addIssue({
      code: "custom",
      path: ["lead"],
      message: `Lead ${p.lead} mm must equal starts * threadPitch (${p.starts * p.threadPitch} mm)`,
    })
  }
  if (p.threadPitch >= p.diameter * 0.6) {
    ctx.addIssue({
      code: "custom",
      path: ["threadPitch"],
      message: "Trapezoidal thread pitch exceeds shaft core allowance",
    })
  }
}
