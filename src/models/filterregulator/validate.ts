import type { z } from "zod"

export interface FilterRegulatorShape {
  portNominal: number
  width: number
  height: number
  depth: number
  knobOuterDiameter: number
  panelThreadDiameter: number
  panelThreadPitch: number
  bottomDrain: boolean
  panelNut: boolean
}

export function validateFilterRegulatorProps(
  p: FilterRegulatorShape,
  ctx: z.RefinementCtx,
): void {
  if (p.knobOuterDiameter > Math.min(p.width, p.depth)) {
    ctx.addIssue({
      code: "custom",
      path: ["knobOuterDiameter"],
      message: "Adjustment knob diameter exceeds manifold body envelope",
    })
  }
  if (p.panelThreadDiameter > Math.min(p.width, p.depth) - 2) {
    ctx.addIssue({
      code: "custom",
      path: ["panelThreadDiameter"],
      message: "Panel mounting neck thread exceeds upper bonnet width",
    })
  }
}
