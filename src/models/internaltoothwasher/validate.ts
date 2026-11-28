import type { z } from "zod"

export interface InternalToothWasherShape {
  innerDiameter: number
  rootInnerDiameter: number
  outerDiameter: number
  thickness: number
  teeth: number
  toothWidth: number
  twistAngle: number
}

export function validateInternalToothWasherProps(
  p: InternalToothWasherShape,
  ctx: z.RefinementCtx,
): void {
  if (
    p.innerDiameter >= p.rootInnerDiameter - 1 ||
    p.rootInnerDiameter >= p.outerDiameter - 1
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["rootInnerDiameter"],
      message:
        "Internal tooth washer requires strictly ordered tip, root, and outer diameters",
    })
  }
  if (p.teeth * p.toothWidth >= Math.PI * p.innerDiameter * 0.9) {
    ctx.addIssue({
      code: "custom",
      path: ["toothWidth"],
      message: "Inward lock teeth overlap at bore circumference",
    })
  }
}
