import type { z } from "zod"

export interface WeldStudShape {
  custom: true
  thread: string
  length: number
  fullThread: true
  baseOuterDiameter: number
  baseHeight: number
  weldTipDiameter: number
  weldTipLength: number
}

export function validateWeldStudProps(
  p: WeldStudShape,
  ctx: z.RefinementCtx,
): void {
  const majorDia = Number(p.thread.slice(1))
  if (p.baseOuterDiameter <= majorDia) {
    ctx.addIssue({
      code: "custom",
      path: ["baseOuterDiameter"],
      message:
        "Weld flange collar diameter must exceed nominal thread diameter",
    })
  }
  if (p.weldTipDiameter >= majorDia) {
    ctx.addIssue({
      code: "custom",
      path: ["weldTipDiameter"],
      message:
        "Capacitor-discharge ignition tip must be smaller than thread OD",
    })
  }
}
