import type { z } from "zod"

export interface GridGratingShape {
  length: number
  width: number
  bearingBarHeight: number
  bearingBarThickness: number
  bearingBarPitch: number
  crossBarThickness: number
  crossBarHeight: number
  crossBarPitch: number
}

export function validateGridGratingProps(
  p: GridGratingShape,
  ctx: z.RefinementCtx,
): void {
  if (p.bearingBarThickness >= p.bearingBarPitch - 4) {
    ctx.addIssue({
      code: "custom",
      path: ["bearingBarThickness"],
      message: "Bearing bar thickness closes off open drainage grid",
    })
  }
  if (p.crossBarThickness >= p.crossBarPitch - 4) {
    ctx.addIssue({
      code: "custom",
      path: ["crossBarThickness"],
      message: "Crossbar thickness closes off longitudinal grating cells",
    })
  }
  if (p.crossBarHeight >= p.bearingBarHeight - 4) {
    ctx.addIssue({
      code: "custom",
      path: ["crossBarHeight"],
      message: "Crossbar notch depth weakens load-bearing bar section",
    })
  }
}
