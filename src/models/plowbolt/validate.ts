import type { z } from "zod"

export interface PlowBoltShape {
  custom: true
  thread: string
  length: number
  threadLength: number
  headOuterDiameter: number
  headAngleDeg: number
  squareNeck: true
  neckWidth: number
  neckLength: number
}

export function validatePlowBoltProps(
  p: PlowBoltShape,
  ctx: z.RefinementCtx,
): void {
  if (p.headOuterDiameter <= p.neckWidth * Math.SQRT2) {
    ctx.addIssue({
      code: "custom",
      path: ["headOuterDiameter"],
      message:
        "Countersunk plow head OD must exceed square neck across-corners",
    })
  }
  if (p.neckLength + p.threadLength > p.length) {
    ctx.addIssue({
      code: "custom",
      path: ["threadLength"],
      message: "Neck length plus thread length exceeds total plow bolt length",
    })
  }
}
