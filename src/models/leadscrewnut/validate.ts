import type { z } from "zod"

export interface LeadScrewNutShape {
  boreDiameter: number
  bodyOuterDiameter: number
  length: number
  flangeOuterDiameter: number
  trapezoidalThread: string
  threadPitch: number
  lead: number
  starts: number
  face4Hole: true
  pitchCircleDiameter: number
  holeDiameter: number
}

export function validateLeadScrewNutProps(
  p: LeadScrewNutShape,
  ctx: z.RefinementCtx,
): void {
  const nominalDiameter = Number(p.trapezoidalThread.slice(2))
  if (Math.abs(p.boreDiameter - nominalDiameter) > 1e-6) {
    ctx.addIssue({
      code: "custom",
      path: ["boreDiameter"],
      message: `Bore ${p.boreDiameter} mm must match trapezoidal designation ${p.trapezoidalThread} (${nominalDiameter} mm)`,
    })
  }
  if (Math.abs(p.lead - p.starts * p.threadPitch) > 1e-6) {
    ctx.addIssue({
      code: "custom",
      path: ["lead"],
      message: `Lead ${p.lead} mm must equal starts * threadPitch (${p.starts * p.threadPitch} mm)`,
    })
  }
  if (p.boreDiameter + 2 >= p.bodyOuterDiameter) {
    ctx.addIssue({
      code: "custom",
      path: ["bodyOuterDiameter"],
      message: "Nut cylindrical barrel diameter is too thin around bore",
    })
  }
  if (p.bodyOuterDiameter >= p.flangeOuterDiameter) {
    ctx.addIssue({
      code: "custom",
      path: ["flangeOuterDiameter"],
      message: "Flange outer diameter must exceed cylindrical barrel diameter",
    })
  }
  if (p.pitchCircleDiameter - p.holeDiameter <= p.bodyOuterDiameter) {
    ctx.addIssue({
      code: "custom",
      path: ["pitchCircleDiameter"],
      message: "Mounting holes intersect nut cylindrical barrel",
    })
  }
  if (p.pitchCircleDiameter + p.holeDiameter >= p.flangeOuterDiameter) {
    ctx.addIssue({
      code: "custom",
      path: ["pitchCircleDiameter"],
      message: "Mounting holes break out of flange outer perimeter",
    })
  }
}
