import type { z } from "zod"

export interface RoundBeltShape {
  crossSectionDiameter: number
  pitchLength: number
  endless: true
  circular: true
}

export function validateRoundBeltProps(
  p: RoundBeltShape,
  ctx: z.RefinementCtx,
): void {
  if (p.pitchLength <= Math.PI * p.crossSectionDiameter * 4) {
    ctx.addIssue({
      code: "custom",
      path: ["pitchLength"],
      message: "Endless belt pitch length is too short for belt diameter",
    })
  }
}
