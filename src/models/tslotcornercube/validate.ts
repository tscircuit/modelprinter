import type { z } from "zod"

export interface TSlotCornerCubeShape {
  width: number
  height: number
  depth: number
  holeDiameter: number
  counterboreDiameter: number
  counterboreDepth: number
  xyzAxes: true
}

export function validateTSlotCornerCubeProps(
  p: TSlotCornerCubeShape,
  ctx: z.RefinementCtx,
): void {
  const minSide = Math.min(p.width, p.height, p.depth)
  if (p.holeDiameter >= p.counterboreDiameter - 1.5) {
    ctx.addIssue({
      code: "custom",
      path: ["holeDiameter"],
      message: "Through-hole diameter leaves no screw-head counterbore seat",
    })
  }
  if (p.counterboreDiameter >= minSide - 4) {
    ctx.addIssue({
      code: "custom",
      path: ["counterboreDiameter"],
      message: "Counterbore diameter breaks through corner cube outer walls",
    })
  }
  if (2 * p.counterboreDepth >= minSide - p.holeDiameter) {
    ctx.addIssue({
      code: "custom",
      path: ["counterboreDepth"],
      message: "Opposed counterbores collide with central 3-axis intersection",
    })
  }
}
