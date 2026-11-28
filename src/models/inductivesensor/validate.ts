import type { z } from "zod"

export interface InductiveSensorShape {
  threadOuterDiameter: number
  threadPitch: number
  length: number
  faceOuterDiameter: number
  cableOuterDiameter: number
  cableLength: number
  nuts: number
  flushFront: boolean
}

export function validateInductiveSensorProps(
  p: InductiveSensorShape,
  ctx: z.RefinementCtx,
): void {
  if (p.faceOuterDiameter > p.threadOuterDiameter) {
    ctx.addIssue({
      code: "custom",
      path: ["faceOuterDiameter"],
      message:
        "Active sensing face diameter cannot exceed threaded barrel outer diameter",
    })
  }
  if (p.cableOuterDiameter >= p.threadOuterDiameter) {
    ctx.addIssue({
      code: "custom",
      path: ["cableOuterDiameter"],
      message: "Rear cable jacket diameter must be smaller than sensor barrel",
    })
  }
}
