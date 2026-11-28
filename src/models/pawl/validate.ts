import type { z } from "zod"

export interface PawlShape {
  length: number
  width: number
  height: number
  pivotDiameter: number
  pivotBore: true
  noseAngleDeg: number
  noseRadius: number
}

export function validatePawlProps(p: PawlShape, ctx: z.RefinementCtx): void {
  if (p.pivotDiameter >= p.width - 2) {
    ctx.addIssue({
      code: "custom",
      path: ["pivotDiameter"],
      message: "Pivot bore leaves insufficient pawl boss wall",
    })
  }
  if (p.noseAngleDeg <= 5 || p.noseAngleDeg >= 60) {
    ctx.addIssue({
      code: "custom",
      path: ["noseAngleDeg"],
      message: "Ratchet pawl nose angle must lie between 5 and 60 degrees",
    })
  }
  if (p.noseRadius >= p.width / 2) {
    ctx.addIssue({
      code: "custom",
      path: ["noseRadius"],
      message: "Nose tip radius exceeds half of pawl width",
    })
  }
}
