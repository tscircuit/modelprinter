import type { z } from "zod"

export interface MicroswitchShape {
  width: number
  height: number
  depth: number
  leverLength: number
  leverThickness: number
  holes: 2
  holeDiameter: number
  holePitch: number
  contacts: 2 | 3
  solderLug: true
}

export function validateMicroswitchProps(
  p: MicroswitchShape,
  ctx: z.RefinementCtx,
): void {
  if (p.holePitch + p.holeDiameter >= p.width) {
    ctx.addIssue({
      code: "custom",
      path: ["holePitch"],
      message: "Side fixing hole pitch exceeds microswitch housing width",
    })
  }
  if (p.leverThickness >= p.depth * 0.5) {
    ctx.addIssue({
      code: "custom",
      path: ["leverThickness"],
      message: "Spring actuator lever thickness exceeds housing depth margin",
    })
  }
}
