import type { z } from "zod"

export interface GearMotorShape {
  bodyOuterDiameter: number
  bodyLength: number
  shaftDiameter: number
  shaftLength: number
  shaftOffset: number
  face4Hole: true
  pitchCircleDiameter: number
  thread: string
  offsetSpur: true
}

export function validateGearMotorProps(
  p: GearMotorShape,
  ctx: z.RefinementCtx,
): void {
  const screwDia = Number(p.thread.slice(1))
  if (!Number.isFinite(screwDia) || screwDia <= 0) {
    ctx.addIssue({
      code: "custom",
      path: ["thread"],
      message: "Invalid metric mounting thread size",
    })
    return
  }
  if (p.shaftOffset + p.shaftDiameter / 2 >= p.bodyOuterDiameter / 2) {
    ctx.addIssue({
      code: "custom",
      path: ["shaftOffset"],
      message:
        "Offset output shaft must remain inside the spur gearbox outer diameter",
    })
  }
  if (p.pitchCircleDiameter + screwDia >= p.bodyOuterDiameter) {
    ctx.addIssue({
      code: "custom",
      path: ["pitchCircleDiameter"],
      message:
        "Front four-hole pitch circle plus thread diameter must stay inside the gearbox face",
    })
  }
}
