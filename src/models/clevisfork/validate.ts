import type { z } from "zod"

export interface ClevisForkShape {
  threadDiameter: number
  length: number
  slotGap: number
  armThickness: number
  armHeight: number
  armLength: number
  pinDiameter: number
  holeOffset: number
  shankOuterDiameter: number
  threadDepth: number
}

export function validateClevisForkProps(
  p: ClevisForkShape,
  ctx: z.RefinementCtx,
): void {
  if (p.threadDiameter >= p.shankOuterDiameter - 1.5) {
    ctx.addIssue({
      code: "custom",
      path: ["threadDiameter"],
      message:
        "Internal thread diameter leaves insufficient shank wall thickness",
    })
  }
  if (
    p.pinDiameter >= p.armHeight - 2 ||
    p.holeOffset >= p.armLength - p.pinDiameter / 2
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["pinDiameter"],
      message: "Clevis cross-pin hole breaks through fork ear",
    })
  }
  if (p.armLength + p.threadDepth > p.length - 1) {
    ctx.addIssue({
      code: "custom",
      path: ["threadDepth"],
      message: "Blind shank thread collides with clevis fork slot root",
    })
  }
}
