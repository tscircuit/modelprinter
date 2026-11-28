import type { z } from "zod"

export interface FillisterHeadScrewShape {
  custom: true
  thread: string
  length: number
  fullThread: true
  headOuterDiameter: number
  headHeight: number
  domeHeight: number
  slotted: true
  slotWidth: number
  slotDepth: number
}

export function validateFillisterHeadScrewProps(
  p: FillisterHeadScrewShape,
  ctx: z.RefinementCtx,
): void {
  const majorDia = Number(p.thread.slice(1))
  if (p.headOuterDiameter <= majorDia) {
    ctx.addIssue({
      code: "custom",
      path: ["headOuterDiameter"],
      message: "Fillister head OD must exceed thread major diameter",
    })
  }
  if (p.domeHeight >= p.headHeight) {
    ctx.addIssue({
      code: "custom",
      path: ["domeHeight"],
      message: "Top dome rise must be smaller than cylindrical head height",
    })
  }
  if (
    p.slotWidth >= p.headOuterDiameter ||
    p.slotDepth >= p.headHeight + p.domeHeight
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["slotDepth"],
      message: "Drive slot width or depth exceeds fillister head envelope",
    })
  }
}
