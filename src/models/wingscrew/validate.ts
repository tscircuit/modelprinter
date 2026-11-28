import type { z } from "zod"

export interface WingScrewShape {
  custom: true
  thread: string
  length: number
  fullThread: true
  twinWing: true
  wingSpan: number
  wingHeight: number
  wingThickness: number
  bossOuterDiameter: number
}

export function validateWingScrewProps(
  p: WingScrewShape,
  ctx: z.RefinementCtx,
): void {
  const majorDia = Number(p.thread.slice(1))
  if (p.bossOuterDiameter <= majorDia) {
    ctx.addIssue({
      code: "custom",
      path: ["bossOuterDiameter"],
      message: "Head boss outer diameter must exceed nominal thread diameter",
    })
  }
  if (p.wingSpan <= p.bossOuterDiameter + 4) {
    ctx.addIssue({
      code: "custom",
      path: ["wingSpan"],
      message: "Twin wing span must project beyond central boss diameter",
    })
  }
  if (p.wingThickness >= p.bossOuterDiameter) {
    ctx.addIssue({
      code: "custom",
      path: ["wingThickness"],
      message: "Wing plate thickness must be narrower than central head boss",
    })
  }
}
