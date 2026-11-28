import type { z } from "zod"

export interface PanelMeterCaseShape {
  width: number
  height: number
  depth: number
  wallThickness: number
  bezelThickness: number
  cutoutWidth: number
  cutoutHeight: number
  sideSpring2Clips: true
  frontWindow: true
}

export function validatePanelMeterCaseProps(
  p: PanelMeterCaseShape,
  ctx: z.RefinementCtx,
): void {
  if (p.cutoutWidth >= p.width) {
    ctx.addIssue({
      code: "custom",
      path: ["cutoutWidth"],
      message: "Panel cutout width must be smaller than front bezel width",
    })
  }
  if (p.cutoutHeight >= p.height) {
    ctx.addIssue({
      code: "custom",
      path: ["cutoutHeight"],
      message: "Panel cutout height must be smaller than front bezel height",
    })
  }
  if (p.cutoutWidth <= 2 * p.wallThickness + 10) {
    ctx.addIssue({
      code: "custom",
      path: ["cutoutWidth"],
      message:
        "Rear sleeve width leaves insufficient interior instrument space",
    })
  }
  if (p.bezelThickness >= p.depth / 3) {
    ctx.addIssue({
      code: "custom",
      path: ["bezelThickness"],
      message: "Bezel thickness must leave rear sleeve insertion depth",
    })
  }
}
