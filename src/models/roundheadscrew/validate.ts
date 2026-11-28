import type { z } from "zod"

export interface RoundHeadScrewShape {
  custom: true
  thread: string
  length: number
  fullThread: true
  hemisphere: true
  headOuterDiameter: number
  headHeight: number
  slotted: true
  slotWidth: number
  slotDepth: number
}

export function validateRoundHeadScrewProps(
  p: RoundHeadScrewShape,
  ctx: z.RefinementCtx,
): void {
  const majorDia = Number(p.thread.slice(1))
  if (p.headOuterDiameter <= majorDia) {
    ctx.addIssue({
      code: "custom",
      path: ["headOuterDiameter"],
      message: "Round head diameter must exceed nominal thread diameter",
    })
  }
  if (Math.abs(p.headHeight - p.headOuterDiameter / 2) > 0.05) {
    ctx.addIssue({
      code: "custom",
      path: ["headHeight"],
      message:
        "True hemispherical head requires headHeight === headOuterDiameter / 2",
    })
  }
  if (p.slotDepth >= p.headHeight || p.slotWidth >= p.headOuterDiameter * 0.5) {
    ctx.addIssue({
      code: "custom",
      path: ["slotDepth"],
      message: "Driver slot dimensions exceed hemispherical head envelope",
    })
  }
}
