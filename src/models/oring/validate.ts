import type { z } from "zod"
import { findAs568ORingSpec } from "./table"

export interface RawORingShape {
  as568: true
  size: string
  round: true
  innerDiameter?: number
  crossSectionDiameter?: number
}

export function validateORingProps(
  p: RawORingShape,
  ctx: z.RefinementCtx,
): void {
  const spec = findAs568ORingSpec(p.size)
  if (!spec) {
    ctx.addIssue({
      code: "custom",
      path: ["size"],
      message: `Unsupported AS568 dash size "${p.size}"`,
    })
    return
  }
  if (
    p.innerDiameter !== undefined &&
    Math.abs(p.innerDiameter - spec.innerDiameter) > 0.02
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["innerDiameter"],
      message: `Inner diameter ${p.innerDiameter} mm contradicts AS568-${spec.size} (${spec.innerDiameter} mm)`,
    })
  }
  if (
    p.crossSectionDiameter !== undefined &&
    Math.abs(p.crossSectionDiameter - spec.crossSectionDiameter) > 0.02
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["crossSectionDiameter"],
      message: `Cross-section diameter ${p.crossSectionDiameter} mm contradicts AS568-${spec.size} (${spec.crossSectionDiameter} mm)`,
    })
  }
}
