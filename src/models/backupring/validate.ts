import type { z } from "zod"

export interface BackupRingShape {
  innerDiameter: number
  outerDiameter: number
  thickness: number
  rectangular: true
  splitAngleDeg: number
  splitGap: number
}

export function validateBackupRingProps(
  p: BackupRingShape,
  ctx: z.RefinementCtx,
): void {
  if (p.innerDiameter >= p.outerDiameter - 0.5) {
    ctx.addIssue({
      code: "custom",
      path: ["outerDiameter"],
      message:
        "Outer diameter must exceed inner diameter with positive radial width",
    })
  }
  if (p.splitAngleDeg <= 0 || p.splitAngleDeg >= 85) {
    ctx.addIssue({
      code: "custom",
      path: ["splitAngleDeg"],
      message: "Scarf split angle must lie between 0 and 85 degrees",
    })
  }
  if (p.splitGap >= p.innerDiameter * 0.25) {
    ctx.addIssue({
      code: "custom",
      path: ["splitGap"],
      message:
        "Split installation gap exceeds valid ring circumference fraction",
    })
  }
}
