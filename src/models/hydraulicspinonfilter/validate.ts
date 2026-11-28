import type { z } from "zod"

export interface HydraulicSpinOnFilterShape {
  canOuterDiameter: number
  height: number
  portNominal: number
  headWidth: number
  headDepth: number
  canThreadDiameter: number
  canThreadPitch: number
  holes: number
  holePitch: number
  holeDiameter: number
  headBolt: boolean
}

export function validateHydraulicSpinOnFilterProps(
  p: HydraulicSpinOnFilterShape,
  ctx: z.RefinementCtx,
): void {
  if (p.canOuterDiameter > p.headWidth) {
    ctx.addIssue({
      code: "custom",
      path: ["canOuterDiameter"],
      message: "Spin-on canister outer diameter exceeds filter head width",
    })
  }
  if (p.canThreadDiameter >= p.canOuterDiameter - 16) {
    ctx.addIssue({
      code: "custom",
      path: ["canThreadDiameter"],
      message: "Center spud thread leaves insufficient seal gasket land",
    })
  }
  if (p.holePitch + p.holeDiameter > p.headWidth - 6) {
    ctx.addIssue({
      code: "custom",
      path: ["holePitch"],
      message: "Head mounting bolt holes break through casting width",
    })
  }
}
