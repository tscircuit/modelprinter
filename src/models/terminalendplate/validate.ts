import type { z } from "zod"

export interface TerminalEndPlateShape {
  width: number
  height: number
  thickness: number
  steppedTerminal: true
  th35x75: true
  pins: 2
  pinOuterDiameter: number
  pinPitch: number
}

export function validateTerminalEndPlateProps(
  p: TerminalEndPlateShape,
  ctx: z.RefinementCtx,
): void {
  if (p.pinPitch + p.pinOuterDiameter >= Math.max(p.width, p.height) - 2) {
    ctx.addIssue({
      code: "custom",
      path: ["pinPitch"],
      message: "Locating pin pitch exceeds insulating end-plate profile",
    })
  }
  if (p.height < 35 && p.width < 35) {
    ctx.addIssue({
      code: "custom",
      path: ["height"],
      message: "End plate profile must span a 35 mm TH35x7.5 DIN rail",
    })
  }
}
