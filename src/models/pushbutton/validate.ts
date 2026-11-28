import type { z } from "zod"

export interface PushbuttonShape {
  cutoutDiameter: number
  bodyOuterDiameter: number
  rearLength: number
  headOuterDiameter: number
  headHeight: number
  roundMomentary: true
  threadNut: true
  rearBlock: true
}

export function validatePushbuttonProps(
  p: PushbuttonShape,
  ctx: z.RefinementCtx,
): void {
  if (p.bodyOuterDiameter > p.cutoutDiameter) {
    ctx.addIssue({
      code: "custom",
      path: ["bodyOuterDiameter"],
      message:
        "Threaded barrel outer diameter must not exceed the panel cutout diameter",
    })
  }
  if (p.headOuterDiameter <= p.cutoutDiameter) {
    ctx.addIssue({
      code: "custom",
      path: ["headOuterDiameter"],
      message:
        "Front pushbutton bezel/head outer diameter must exceed the panel cutout diameter",
    })
  }
}
