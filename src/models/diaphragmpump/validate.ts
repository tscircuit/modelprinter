import type { z } from "zod"

export interface DiaphragmPumpShape {
  portOuterDiameter: number
  length: number
  width: number
  height: number
  holePitch: number
  holes: number
  holeDiameter: number
  twinDiaphragm: boolean
  airDrive: boolean
}

export function validateDiaphragmPumpProps(
  p: DiaphragmPumpShape,
  ctx: z.RefinementCtx,
): void {
  if (p.holePitch + p.holeDiameter > Math.min(p.length, p.width) - 2) {
    ctx.addIssue({
      code: "custom",
      path: ["holePitch"],
      message: "Foot mounting bolt pitch exceeds pump base envelope",
    })
  }
  if (p.portOuterDiameter >= p.height / 2) {
    ctx.addIssue({
      code: "custom",
      path: ["portOuterDiameter"],
      message: "Manifold barb outer diameter exceeds upper header height",
    })
  }
}
