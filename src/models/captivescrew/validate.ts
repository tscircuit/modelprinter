import type { z } from "zod"

export interface CaptiveScrewShape {
  custom: true
  thread: string
  length: number
  threadLength: number
  neckDiameter: number
  neckLength: number
  panHead: true
  headOuterDiameter: number
  headHeight: number
  phillips: true
}

export function validateCaptiveScrewProps(
  p: CaptiveScrewShape,
  ctx: z.RefinementCtx,
): void {
  const majorDia = Number(p.thread.slice(1))
  if (p.neckDiameter >= majorDia - 0.2) {
    ctx.addIssue({
      code: "custom",
      path: ["neckDiameter"],
      message:
        "Captive retention neck diameter must be reduced below thread major diameter",
    })
  }
  if (Math.abs(p.neckLength + p.threadLength - p.length) > 1e-6) {
    ctx.addIssue({
      code: "custom",
      path: ["length"],
      message: "Under-head length must equal neckLength + threadLength",
    })
  }
  if (p.headOuterDiameter <= majorDia) {
    ctx.addIssue({
      code: "custom",
      path: ["headOuterDiameter"],
      message: "Pan head diameter must exceed nominal thread diameter",
    })
  }
}
