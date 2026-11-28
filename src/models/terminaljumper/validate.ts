import type { z } from "zod"

export interface TerminalJumperShape {
  pitch: number
  poles: number
  thickness: number
  stripWidth: number
  prongWidth: number
  prongLength: number
  comb: true
}

export function validateTerminalJumperProps(
  p: TerminalJumperShape,
  ctx: z.RefinementCtx,
): void {
  if (p.prongWidth >= p.pitch - 0.5) {
    ctx.addIssue({
      code: "custom",
      path: ["prongWidth"],
      message: "Comb prong width must be narrower than pole pitch",
    })
  }
}
