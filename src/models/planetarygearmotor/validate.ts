import type { z } from "zod"

export interface PlanetaryGearmotorShape {
  motorOuterDiameter: number
  length: number
  shaftDiameter: number
  face4Hole: true
  pcd: number
  mountThread: string
  coaxial: true
}

export function validatePlanetaryGearmotorProps(
  p: PlanetaryGearmotorShape,
  ctx: z.RefinementCtx,
): void {
  const threadMajor = Number(p.mountThread.slice(1))
  if (p.pcd - threadMajor <= p.shaftDiameter + 2) {
    ctx.addIssue({
      code: "custom",
      path: ["pcd"],
      message: "Front mounting bolt circle collides with output shaft boss",
    })
  }
  if (p.pcd + threadMajor >= p.motorOuterDiameter) {
    ctx.addIssue({
      code: "custom",
      path: ["pcd"],
      message: "Front mounting bolt circle exceeds gearbox outer diameter",
    })
  }
}
