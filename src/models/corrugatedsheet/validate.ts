import type { z } from "zod"

export interface CorrugatedSheetShape {
  length: number
  width: number
  thickness: number
  pitch: number
  peakToPeak: number
  phaseAngle: number
  sineWave: true
}

export function validateCorrugatedSheetProps(
  p: CorrugatedSheetShape,
  ctx: z.RefinementCtx,
): void {
  if (p.thickness >= p.peakToPeak) {
    ctx.addIssue({
      code: "custom",
      path: ["thickness"],
      message: "Sheet gauge thickness exceeds wave peak-to-peak amplitude",
    })
  }
  if (p.pitch > p.width / 2) {
    ctx.addIssue({
      code: "custom",
      path: ["pitch"],
      message: "Corrugation wavelength exceeds half panel width",
    })
  }
}
