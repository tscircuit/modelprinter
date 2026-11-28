import type { z } from "zod"

export interface SphericalPlainBearingShape {
  innerDiameter: number
  outerDiameter: number
  width: number
  misalignmentAngle: number
  radial: true
  closure: "open" | "sealed"
}

export function validateSphericalPlainBearingProps(
  p: SphericalPlainBearingShape,
  ctx: z.RefinementCtx,
): void {
  if (p.innerDiameter >= p.outerDiameter - 6) {
    ctx.addIssue({
      code: "custom",
      path: ["innerDiameter"],
      message: "Inner bore leaves insufficient spherical sliding ring section",
    })
  }
  if (p.width < 5) {
    ctx.addIssue({
      code: "custom",
      path: ["width"],
      message: "Inner ball width is too narrow for radial spherical joint",
    })
  }
}
