import type { z } from "zod"

export interface CamLatchShape {
  cutoutDiameter: number
  thread: string
  threadPitch: number
  barrelLength: number
  headOuterDiameter: number
  camLength: number
  camWidth: number
  camThickness: number
  slotDrive: true
  turnAngle: 90
}

export function validateCamLatchProps(
  p: CamLatchShape,
  ctx: z.RefinementCtx,
): void {
  const threadNominal = Number(p.thread.slice(1))
  if (
    !Number.isFinite(threadNominal) ||
    threadNominal <= 0 ||
    Math.abs(threadNominal - p.cutoutDiameter) > 1.5
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["thread"],
      message:
        "Barrel metric thread diameter must match the panel cutout diameter within clearance",
    })
  }
  if (p.headOuterDiameter <= p.cutoutDiameter) {
    ctx.addIssue({
      code: "custom",
      path: ["headOuterDiameter"],
      message:
        "Front head flange diameter must exceed the panel cutout diameter",
    })
  }
  if (p.camLength <= p.cutoutDiameter / 2) {
    ctx.addIssue({
      code: "custom",
      path: ["camLength"],
      message: "Rear cam arm length must project beyond the barrel radius",
    })
  }
  if (p.camThickness >= p.barrelLength) {
    ctx.addIssue({
      code: "custom",
      path: ["camThickness"],
      message: "Rear cam bar thickness must be smaller than the barrel length",
    })
  }
}
