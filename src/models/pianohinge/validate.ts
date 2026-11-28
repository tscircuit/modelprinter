import type { z } from "zod"

export interface PianoHingeShape {
  openWidth: number
  length: number
  leafThickness: number
  pinDiameter: number
  knuckleLength: number
  holeDiameter: number
  holePitch: number
  rows: 2
  openAngle: 180
  holes: number
  endOffset: number
}

export function validatePianoHingeProps(
  p: PianoHingeShape,
  ctx: z.RefinementCtx,
): void {
  if (p.holes % 2 !== 0) {
    ctx.addIssue({
      code: "custom",
      path: ["holes"],
      message:
        "Two-row continuous piano hinge requires an even total hole count",
    })
  }
  if (p.knuckleLength >= p.length / 3) {
    ctx.addIssue({
      code: "custom",
      path: ["knuckleLength"],
      message:
        "Continuous piano hinge requires at least four knuckle divisions",
    })
  }
  const holesPerRow = p.holes / 2
  const requiredSpan = 2 * p.endOffset + (holesPerRow - 1) * p.holePitch
  if (requiredSpan > p.length + 1e-6) {
    ctx.addIssue({
      code: "custom",
      path: ["holePitch"],
      message:
        "End offsets plus longitudinal hole pitch span cannot exceed hinge length",
    })
  }
  if (p.pinDiameter + 2 * p.leafThickness + 2 * p.holeDiameter >= p.openWidth) {
    ctx.addIssue({
      code: "custom",
      path: ["openWidth"],
      message:
        "Open width must fit both leaf screw rows outside the central knuckle barrel",
    })
  }
}
