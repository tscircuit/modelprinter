import type { z } from "zod"

export interface LinearRailShape {
  hgr15: true
  width: number
  height: number
  length: number
  pitch: number
  firstHole: number
  holes: number
  holeDiameter: number
  counterboreDiameter: number
  counterboreDepth: number
}

const HGR15_NOMINAL = {
  width: 15,
  height: 15,
  pitch: 60,
  holeDiameter: 4.5,
  counterboreDiameter: 7.5,
  counterboreDepth: 5.3,
} as const

export function validateLinearRailProps(
  p: LinearRailShape,
  ctx: z.RefinementCtx,
): void {
  for (const key of Object.keys(
    HGR15_NOMINAL,
  ) as (keyof typeof HGR15_NOMINAL)[]) {
    if (Math.abs(p[key] - HGR15_NOMINAL[key]) > 1e-6) {
      ctx.addIssue({
        code: "custom",
        path: [key],
        message: `Dimension ${key}=${p[key]} mm contradicts pinned HGR15 profile (${HGR15_NOMINAL[key]} mm)`,
      })
    }
  }
  const minEndMargin = p.counterboreDiameter / 2
  const lastHole = p.firstHole + (p.holes - 1) * p.pitch
  if (p.firstHole < minEndMargin || p.length - lastHole < minEndMargin) {
    ctx.addIssue({
      code: "custom",
      path: ["holes"],
      message: "Counterbored mounting holes exceed rail end margins",
    })
  }
}
