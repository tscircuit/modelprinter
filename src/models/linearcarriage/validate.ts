import type { z } from "zod"

export interface LinearCarriageShape {
  hgh15ca: true
  railHgr15: true
  width: number
  length: number
  assemblyHeight: number
  holeGridX: number
  holeGridY: number
  tappedHoles: true
  thread: string
  threadDepth: number
}

const HGH15CA_NOMINAL = {
  width: 34,
  length: 61.4,
  assemblyHeight: 28,
  holeGridX: 26,
  holeGridY: 26,
  threadDepth: 5,
} as const

export function validateLinearCarriageProps(
  p: LinearCarriageShape,
  ctx: z.RefinementCtx,
): void {
  for (const key of Object.keys(
    HGH15CA_NOMINAL,
  ) as (keyof typeof HGH15CA_NOMINAL)[]) {
    if (Math.abs(p[key] - HGH15CA_NOMINAL[key]) > 1e-6) {
      ctx.addIssue({
        code: "custom",
        path: [key],
        message: `Dimension ${key}=${p[key]} mm contradicts pinned HGH15CA profile (${HGH15CA_NOMINAL[key]} mm)`,
      })
    }
  }
  if (p.thread.toLowerCase() !== "m4") {
    ctx.addIssue({
      code: "custom",
      path: ["thread"],
      message: "HGH15CA carriage requires M4 top tapped mounting holes",
    })
  }
}
