import type { z } from "zod"

export interface JunctionBoxShape {
  width: number
  depth: number
  height: number
  wallThickness: number
  cornerRadius: number
  frontKnockoutDiameter: number
  rightKnockoutDiameter: number
  rearKnockoutDiameter: number
  leftKnockoutDiameter: number
  screwOnLid: true
  lidScrews: 4
  holePitchX: number
  holePitchY: number
}

export function validateJunctionBoxProps(
  p: JunctionBoxShape,
  ctx: z.RefinementCtx,
): void {
  if (p.wallThickness * 2 >= Math.min(p.width, p.depth)) {
    ctx.addIssue({
      code: "custom",
      path: ["wallThickness"],
      message: "Wall thickness must leave an interior wiring cavity",
    })
  }
  if (p.cornerRadius > Math.min(p.width, p.depth) / 4) {
    ctx.addIssue({
      code: "custom",
      path: ["cornerRadius"],
      message:
        "Exterior corner radius must leave flat side-wall faces for knockouts",
    })
  }
  const clearHeight = p.height - 2 * p.wallThickness
  const clearFrontRearWidth =
    p.width - 2 * Math.max(p.wallThickness, p.cornerRadius)
  const clearLeftRightDepth =
    p.depth - 2 * Math.max(p.wallThickness, p.cornerRadius)
  if (
    Math.max(p.frontKnockoutDiameter, p.rearKnockoutDiameter) >=
    Math.min(clearFrontRearWidth, clearHeight)
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["frontKnockoutDiameter"],
      message: "Front and rear knockouts must fit inside the flat wall faces",
    })
  }
  if (
    Math.max(p.leftKnockoutDiameter, p.rightKnockoutDiameter) >=
    Math.min(clearLeftRightDepth, clearHeight)
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["leftKnockoutDiameter"],
      message: "Left and right knockouts must fit inside the flat wall faces",
    })
  }
  if (
    p.holePitchX >= p.width - 2 * p.wallThickness ||
    p.holePitchY >= p.depth - 2 * p.wallThickness
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["holePitchX"],
      message:
        "Corner lid screw pitch must stay inside the interior boss perimeter",
    })
  }
}
