import type { z } from "zod"

export interface PinHeatsinkShape {
  width: number
  length: number
  baseThickness: number
  height: number
  pinOuterDiameter: number
  gridX: number
  gridY: number
  pitch: number
  holes: 4
  holeDiameter: number
  holePitchX: number
  holePitchY: number
}

export function validatePinHeatsinkProps(
  p: PinHeatsinkShape,
  ctx: z.RefinementCtx,
): void {
  if (p.baseThickness >= p.height - 2) {
    ctx.addIssue({
      code: "custom",
      path: ["baseThickness"],
      message: "Base plate thickness must leave positive cooling pin height",
    })
  }
  if (p.pinOuterDiameter >= p.pitch - 0.5) {
    ctx.addIssue({
      code: "custom",
      path: ["pinOuterDiameter"],
      message: "Cooling pin diameter must be smaller than pin grid pitch",
    })
  }
  if (
    (p.gridX - 1) * p.pitch + p.pinOuterDiameter >= p.width ||
    (p.gridY - 1) * p.pitch + p.pinOuterDiameter >= p.length
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["pitch"],
      message: "Pin grid span exceeds base plate footprint",
    })
  }
  if (
    p.holePitchX + p.holeDiameter >= p.width ||
    p.holePitchY + p.holeDiameter >= p.length
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["holePitchX"],
      message: "Corner mounting holes exceed base plate footprint",
    })
  }
}
