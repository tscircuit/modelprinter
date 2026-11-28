import type { z } from "zod"

export interface SnapButtonShape {
  buttonDiameter: number
  buttonHeight: number
  springWidth: number
  springThickness: number
  legLength: number
  legAngle: number
  tubeInnerDiameter: number
}

export function validateSnapButtonProps(
  p: SnapButtonShape,
  ctx: z.RefinementCtx,
): void {
  if (
    p.buttonDiameter > p.springWidth + 2 ||
    p.buttonDiameter >= p.tubeInnerDiameter - 4
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["buttonDiameter"],
      message: "Snap button diameter exceeds leaf-spring leg or host tube bore",
    })
  }
  if (p.springThickness >= p.buttonHeight) {
    ctx.addIssue({
      code: "custom",
      path: ["springThickness"],
      message: "Leaf-spring strip thickness exceeds projecting button height",
    })
  }
}
