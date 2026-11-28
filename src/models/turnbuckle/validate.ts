import type { z } from "zod"

export interface TurnbuckleShape {
  threadDiameter: number
  bodyLength: number
  bodyWidth: number
  bodyHeight: number
  openLength: number
  openWidth: number
  eyeInnerDiameter: number
  eyeWireDiameter: number
  endLength: number
  opposedThread: true
  centered: true
}

export function validateTurnbuckleProps(
  p: TurnbuckleShape,
  ctx: z.RefinementCtx,
): void {
  if (p.openLength >= p.bodyLength - 2 * p.threadDiameter) {
    ctx.addIssue({
      code: "custom",
      path: ["openLength"],
      message:
        "Turnbuckle window length leaves insufficient threaded end bosses",
    })
  }
  if (p.openWidth >= p.bodyWidth - 4 || p.threadDiameter >= p.bodyHeight - 2) {
    ctx.addIssue({
      code: "custom",
      path: ["openWidth"],
      message: "Window width or thread bore exceeds turnbuckle frame rails",
    })
  }
}
