import type { z } from "zod"

export interface HingedBoxShape {
  width: number
  depth: number
  height: number
  wallThickness: number
  cornerRadius: number
  lidThickness: number
  leftHinge: true
  hingePinDiameter: number
  knuckles: number
  rightLatch: true
}

export function validateHingedBoxProps(
  p: HingedBoxShape,
  ctx: z.RefinementCtx,
): void {
  if (p.knuckles % 2 === 0) {
    ctx.addIssue({
      code: "custom",
      path: ["knuckles"],
      message:
        "Symmetric alternating hinge barrel requires an odd knuckle count",
    })
  }
  if (p.wallThickness * 2 >= Math.min(p.width, p.depth)) {
    ctx.addIssue({
      code: "custom",
      path: ["wallThickness"],
      message: "Wall thickness must leave an open interior enclosure cavity",
    })
  }
  if (p.lidThickness >= p.height * 0.4) {
    ctx.addIssue({
      code: "custom",
      path: ["lidThickness"],
      message: "Flush lid thickness must be smaller than 40% of overall height",
    })
  }
  if (p.hingePinDiameter >= p.depth / p.knuckles) {
    ctx.addIssue({
      code: "custom",
      path: ["hingePinDiameter"],
      message:
        "Hinge pin diameter must be smaller than individual knuckle length",
    })
  }
}
