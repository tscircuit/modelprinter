import type { z } from "zod"

export interface SlottedTubeShape {
  outerDiameter: number
  wallThickness: number
  length: number
  slotWidth: number
  slotLength: number
  axialPitch: number
  rows: number
  around: number
  endMargin: number
}

export function validateSlottedTubeProps(
  p: SlottedTubeShape,
  ctx: z.RefinementCtx,
): void {
  if (2 * p.wallThickness >= p.outerDiameter - 2) {
    ctx.addIssue({
      code: "custom",
      path: ["wallThickness"],
      message: "Wall thickness closes off hollow tube bore",
    })
  }
  if (p.slotLength >= p.axialPitch) {
    ctx.addIssue({
      code: "custom",
      path: ["slotLength"],
      message: "Slot length must be shorter than axial row pitch",
    })
  }
  const innerCircumference = Math.PI * (p.outerDiameter - 2 * p.wallThickness)
  if (p.around * p.slotWidth >= innerCircumference * 0.85) {
    ctx.addIssue({
      code: "custom",
      path: ["around"],
      message: "Circumferential slots sever tube wall ligaments",
    })
  }
  if (p.endMargin <= p.slotLength / 2) {
    ctx.addIssue({
      code: "custom",
      path: ["endMargin"],
      message: "End row center margin must clear half of slot length",
    })
  }
  const totalPatternLength = 2 * p.endMargin + (p.rows - 1) * p.axialPitch
  if (totalPatternLength > p.length + 1e-6) {
    ctx.addIssue({
      code: "custom",
      path: ["rows"],
      message: "Axial slot row centers plus end margins exceed tube length",
    })
  }
}
