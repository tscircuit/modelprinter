import type { z } from "zod"

export interface AxialFanShape {
  width: number
  height: number
  depth: number
  holeDiameter: number
  holePitchX: number
  holePitchY: number
  hubOuterDiameter: number
  blades: number
  cwFront: true
  frontToRear: true
  bladePitchAngle: number
  flatPitched: true
}

export function validateAxialFanProps(
  p: AxialFanShape,
  ctx: z.RefinementCtx,
): void {
  if (p.hubOuterDiameter >= Math.min(p.width, p.height) * 0.8) {
    ctx.addIssue({
      code: "custom",
      path: ["hubOuterDiameter"],
      message: "Impeller hub diameter must leave annular airflow swept area",
    })
  }
  if (
    p.holePitchX + p.holeDiameter >= p.width ||
    p.holePitchY + p.holeDiameter >= p.height
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["holePitchX"],
      message: "Corner mounting holes must stay inside the square fan frame",
    })
  }
}
