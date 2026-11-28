import type { z } from "zod"

export interface FlangedTimingPulleyShape {
  teeth: number
  pitch: number
  boreDiameter: number
  width: number
  flangeOuterDiameter: number
  htd5m: true
  setScrew: true
  setScrewThread: string
}

export function validateFlangedTimingPulleyProps(
  p: FlangedTimingPulleyShape,
  ctx: z.RefinementCtx,
): void {
  if (Math.abs(p.pitch - 5) > 1e-6) {
    ctx.addIssue({
      code: "custom",
      path: ["pitch"],
      message:
        "HTD 5M curvilinear tooth profile requires a 5 mm circular pitch",
    })
  }
  const pitchDia = (p.teeth * p.pitch) / Math.PI
  if (p.boreDiameter >= pitchDia - 4) {
    ctx.addIssue({
      code: "custom",
      path: ["boreDiameter"],
      message: "Bore diameter leaves insufficient pulley root wall thickness",
    })
  }
  if (p.flangeOuterDiameter <= pitchDia + 1) {
    ctx.addIssue({
      code: "custom",
      path: ["flangeOuterDiameter"],
      message: "Belt-retaining side flange OD must exceed tooth pitch diameter",
    })
  }
}
