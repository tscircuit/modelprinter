import type { z } from "zod"

export interface SolidInsertShape {
  custom: true
  internalThread: string
  externalDiameter: number
  externalThreadPitch: number
  length: number
  slotted: true
  slotWidth: number
  slotDepth: number
  through: true
}

export function validateSolidInsertProps(
  p: SolidInsertShape,
  ctx: z.RefinementCtx,
): void {
  const internalMajor = Number(p.internalThread.slice(1))
  if (p.externalDiameter <= internalMajor + 1.5) {
    ctx.addIssue({
      code: "custom",
      path: ["externalDiameter"],
      message:
        "External repair thread OD must exceed internal thread major dia",
    })
  }
  if (p.slotDepth >= p.length * 0.5) {
    ctx.addIssue({
      code: "custom",
      path: ["slotDepth"],
      message: "Top drive slot depth exceeds half of insert length",
    })
  }
  if (p.slotWidth >= internalMajor) {
    ctx.addIssue({
      code: "custom",
      path: ["slotWidth"],
      message: "Top drive slot width exceeds internal bore diameter",
    })
  }
}
