import type { z } from "zod"

export interface GroundingBusbarShape {
  length: number
  width: number
  thickness: number
  bores: number
  boreDiameter: number
  pitch: number
  screwThread: string
  mounts: 2
  holeDiameter: number
  holePitch: number
}

export function validateGroundingBusbarProps(
  p: GroundingBusbarShape,
  ctx: z.RefinementCtx,
): void {
  const screwMajor = Number(p.screwThread.slice(1))
  if (p.boreDiameter >= p.pitch) {
    ctx.addIssue({
      code: "custom",
      path: ["pitch"],
      message: "Conductor bore pitch must exceed conductor bore diameter",
    })
  }
  if (screwMajor >= p.pitch) {
    ctx.addIssue({
      code: "custom",
      path: ["screwThread"],
      message: "Top clamping screw diameter must fit within conductor pitch",
    })
  }
  const conductorSpan = (p.bores - 1) * p.pitch + p.boreDiameter
  if (conductorSpan >= p.holePitch - p.holeDiameter) {
    ctx.addIssue({
      code: "custom",
      path: ["holePitch"],
      message: "Conductor bore row overlaps end mounting holes",
    })
  }
  if (p.holePitch + p.holeDiameter >= p.length) {
    ctx.addIssue({
      code: "custom",
      path: ["length"],
      message: "End mounting hole pitch exceeds overall busbar length",
    })
  }
}
