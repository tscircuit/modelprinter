import type { z } from "zod"

export interface RackStepBeamShape {
  length: number
  height: number
  width: number
  wallThickness: number
  stepWidth: number
  stepDepth: number
  cornerRadius: number
  endHoles: number
  holeDiameter: number
  holePitch: number
}

export function validateRackStepBeamProps(
  p: RackStepBeamShape,
  ctx: z.RefinementCtx,
): void {
  if (p.stepWidth >= p.width - 2 * p.wallThickness - 4) {
    ctx.addIssue({
      code: "custom",
      path: ["stepWidth"],
      message: "Decking step recess width consumes upper box-beam flange",
    })
  }
  if (p.stepDepth >= p.height - 2 * p.wallThickness - 10) {
    ctx.addIssue({
      code: "custom",
      path: ["stepDepth"],
      message: "Decking step depth consumes structural beam web height",
    })
  }
  if (p.holePitch >= p.height - p.holeDiameter - 6) {
    ctx.addIssue({
      code: "custom",
      path: ["holePitch"],
      message: "End-connector hole pitch breaks through beam top or bottom",
    })
  }
}
