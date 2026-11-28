import type { z } from "zod"

export interface GuardPostClampShape {
  insideWidth: number
  insideDepth: number
  height: number
  wallThickness: number
  earWidth: number
  earThickness: number
  earHoles: number
  holeDiameter: number
  earPitch: number
}

export function validateGuardPostClampProps(
  p: GuardPostClampShape,
  ctx: z.RefinementCtx,
): void {
  if (p.holeDiameter >= p.earWidth - 2) {
    ctx.addIssue({
      code: "custom",
      path: ["holeDiameter"],
      message: "Clamping bolt hole exceeds projecting ear lug width",
    })
  }
  if (p.earPitch <= p.insideWidth + 2 * p.wallThickness) {
    ctx.addIssue({
      code: "custom",
      path: ["earPitch"],
      message: "Opposed ear bolt pitch collides with square post collar wall",
    })
  }
}
