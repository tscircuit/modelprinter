import type { z } from "zod"

export interface EyeNutShape {
  custom: true
  thread: string
  eyeInnerDiameter: number
  eyeWireDiameter: number
  baseOuterDiameter: number
  baseHeight: number
  threadDepth: number
  closedEye: true
  axialPlane: true
}

export function validateEyeNutProps(
  p: EyeNutShape,
  ctx: z.RefinementCtx,
): void {
  const majorDia = Number(p.thread.slice(1))
  if (p.baseOuterDiameter <= majorDia + 3) {
    ctx.addIssue({
      code: "custom",
      path: ["baseOuterDiameter"],
      message:
        "Round collar base OD must exceed thread major diameter by >3 mm",
    })
  }
  if (p.threadDepth > p.baseHeight) {
    ctx.addIssue({
      code: "custom",
      path: ["threadDepth"],
      message: "Blind internal thread depth cannot exceed base height",
    })
  }
  if (p.eyeInnerDiameter <= majorDia) {
    ctx.addIssue({
      code: "custom",
      path: ["eyeInnerDiameter"],
      message: "Lifting eye inner bore must exceed thread diameter",
    })
  }
}
