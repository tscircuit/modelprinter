import type { z } from "zod"

export interface AntiBacklashNutShape {
  boreDiameter: number
  outerDiameter: number
  length: number
  trapezoidalThread: string
  threadPitch: number
  lead: number
  starts: number
  face2Hole: true
  flangeOuterDiameter: number
  pcd: number
  holeDiameter: number
}

export function validateAntiBacklashNutProps(
  p: AntiBacklashNutShape,
  ctx: z.RefinementCtx,
): void {
  if (Math.abs(p.threadPitch * p.starts - p.lead) > 1e-6) {
    ctx.addIssue({
      code: "custom",
      path: ["lead"],
      message: "Nut lead must equal threadPitch multiplied by starts",
    })
  }
  if (p.boreDiameter >= p.outerDiameter - 4) {
    ctx.addIssue({
      code: "custom",
      path: ["boreDiameter"],
      message: "Bore diameter leaves insufficient nut sleeve wall thickness",
    })
  }
  if (p.pcd - p.holeDiameter <= p.outerDiameter) {
    ctx.addIssue({
      code: "custom",
      path: ["pcd"],
      message: "Flange mounting holes collide with nut body cylinder",
    })
  }
  if (p.pcd + p.holeDiameter >= p.flangeOuterDiameter) {
    ctx.addIssue({
      code: "custom",
      path: ["pcd"],
      message: "Flange mounting holes exceed flange outer diameter",
    })
  }
}
