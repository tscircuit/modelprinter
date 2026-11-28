import type { z } from "zod"

export interface HookBoltShape {
  custom: true
  thread: string
  straightLength: number
  threadLength: number
  hookInnerDiameter: number
  hookAngleDeg: number
  hookWireDiameter: number
  flatTip: true
}

export function validateHookBoltProps(
  p: HookBoltShape,
  ctx: z.RefinementCtx,
): void {
  if (p.threadLength > p.straightLength) {
    ctx.addIssue({
      code: "custom",
      path: ["threadLength"],
      message: "Threaded tip length cannot exceed straight leg length",
    })
  }
  if (p.hookInnerDiameter <= p.hookWireDiameter) {
    ctx.addIssue({
      code: "custom",
      path: ["hookInnerDiameter"],
      message: "Hook inner bend diameter must exceed wire stock diameter",
    })
  }
}
