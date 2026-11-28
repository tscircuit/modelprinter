import type { z } from "zod"

export interface LimitSwitchShape {
  width: number
  height: number
  depth: number
  leverLength: number
  rollerOuterDiameter: number
  pivotDiameter: number
  holes: number
  holeDiameter: number
  holePitch: number
  entryDiameter: number
  entryPitch: number
}

export function validateLimitSwitchProps(
  p: LimitSwitchShape,
  ctx: z.RefinementCtx,
): void {
  if (p.holePitch + p.holeDiameter > p.height - 4) {
    ctx.addIssue({
      code: "custom",
      path: ["holePitch"],
      message:
        "Vertical mounting hole pitch breaks through switch housing ends",
    })
  }
  if (p.entryDiameter >= Math.min(p.width, p.depth) - 3) {
    ctx.addIssue({
      code: "custom",
      path: ["entryDiameter"],
      message: "Conduit cable entry thread exceeds bottom housing wall",
    })
  }
  if (p.pivotDiameter >= p.rollerOuterDiameter) {
    ctx.addIssue({
      code: "custom",
      path: ["pivotDiameter"],
      message:
        "Pivot shaft diameter must be smaller than roller outer diameter",
    })
  }
}
