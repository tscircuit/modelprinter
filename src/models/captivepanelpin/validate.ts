import type { z } from "zod"

export interface CaptivePanelPinShape {
  pinDiameter: number
  length: number
  knobOuterDiameter: number
  knobHeight: number
  collarOuterDiameter: number
  collarHeight: number
  springOuterDiameter: number
  wireDiameter: number
  stroke: number
  extended: true
}

export function validateCaptivePanelPinProps(
  p: CaptivePanelPinShape,
  ctx: z.RefinementCtx,
): void {
  if (
    p.pinDiameter >= p.collarOuterDiameter - 1.5 ||
    p.collarOuterDiameter >= p.knobOuterDiameter - 2
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["collarOuterDiameter"],
      message:
        "Captive pin requires ordered shank, retaining collar, and pull-knob diameters",
    })
  }
  if (p.stroke + p.collarHeight >= p.length - 5) {
    ctx.addIssue({
      code: "custom",
      path: ["stroke"],
      message: "Spring stroke exceeds captive pin shank engagement length",
    })
  }
}
