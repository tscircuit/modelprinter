import type { z } from "zod"

export interface SubmersiblePumpShape {
  bodyOuterDiameter: number
  height: number
  outletOuterDiameter: number
  baseOuterDiameter: number
  holes: number
  boltCircleDiameter: number
  holeDiameter: number
  topBarb: boolean
  baseFeet: boolean
}

export function validateSubmersiblePumpProps(
  p: SubmersiblePumpShape,
  ctx: z.RefinementCtx,
): void {
  if (p.baseOuterDiameter <= p.bodyOuterDiameter) {
    ctx.addIssue({
      code: "custom",
      path: ["baseOuterDiameter"],
      message:
        "Base flange outer diameter must exceed pump body outer diameter",
    })
  }
  if (p.boltCircleDiameter + p.holeDiameter > p.baseOuterDiameter - 3) {
    ctx.addIssue({
      code: "custom",
      path: ["boltCircleDiameter"],
      message: "Mounting bolt circle breaks through base flange rim",
    })
  }
  if (p.outletOuterDiameter >= p.bodyOuterDiameter - 10) {
    ctx.addIssue({
      code: "custom",
      path: ["outletOuterDiameter"],
      message: "Top discharge outlet diameter exceeds upper pump cap",
    })
  }
}
