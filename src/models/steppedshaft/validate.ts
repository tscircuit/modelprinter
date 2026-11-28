import type { z } from "zod"

export interface SteppedShaftShape {
  diameter: number
  endDiameter: number
  length: number
  endLength: number
  shoulderFillet: number
  endChamfer: number
}

export function validateSteppedShaftProps(
  p: SteppedShaftShape,
  ctx: z.RefinementCtx,
): void {
  if (p.endDiameter >= p.diameter) {
    ctx.addIssue({
      code: "custom",
      path: ["endDiameter"],
      message:
        "Reduced end journal diameter must be smaller than main shaft diameter",
    })
  }
  if (2 * p.endLength >= p.length) {
    ctx.addIssue({
      code: "custom",
      path: ["endLength"],
      message: "Two end journals must leave a positive central shaft section",
    })
  }
  const stepHeight = (p.diameter - p.endDiameter) / 2
  if (p.shoulderFillet > stepHeight || p.shoulderFillet >= p.endLength) {
    ctx.addIssue({
      code: "custom",
      path: ["shoulderFillet"],
      message: "Shoulder fillet exceeds radial step height or journal length",
    })
  }
  if (p.endChamfer >= p.endDiameter / 2 || p.endChamfer >= p.endLength) {
    ctx.addIssue({
      code: "custom",
      path: ["endChamfer"],
      message: "End chamfer exceeds reduced journal radius or length",
    })
  }
}
