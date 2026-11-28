import type { z } from "zod"

export interface ViseSwivelBaseShape {
  outerDiameter: number
  height: number
  baseThickness: number
  topOuterDiameter: number
  topThickness: number
  pilotDiameter: number
  pilotHeight: number
  arcs: number
  arcPcd: number
  arcAngle: number
  arcWidth: number
  topHoles: number
  topHoleDiameter: number
  pitchX: number
  pitchY: number
}

export function validateViseSwivelBaseProps(
  p: ViseSwivelBaseShape,
  ctx: z.RefinementCtx,
): void {
  if (
    p.pilotDiameter >= p.topOuterDiameter - 20 ||
    p.topOuterDiameter >= p.outerDiameter - 10
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["topOuterDiameter"],
      message:
        "Swivel base requires ordered pilot register, upper turntable, and flange diameters",
    })
  }
  if (p.arcPcd + p.arcWidth >= p.outerDiameter - 4) {
    ctx.addIssue({
      code: "custom",
      path: ["arcPcd"],
      message: "Arcuate locking slots break through outer base flange",
    })
  }
  if (
    Math.hypot(p.pitchX, p.pitchY) + p.topHoleDiameter >=
    p.topOuterDiameter - 4
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["pitchX"],
      message: "Top vise mounting holes overhang upper turntable",
    })
  }
}
