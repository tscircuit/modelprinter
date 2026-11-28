import type { z } from "zod"

export interface TSlotFloorBracketShape {
  width: number
  depth: number
  height: number
  thickness: number
  ribs: number
  ribThickness: number
  holeDiameter: number
  baseHolePitch: number
  wallHolePitch: number
}

export function validateTSlotFloorBracketProps(
  p: TSlotFloorBracketShape,
  ctx: z.RefinementCtx,
): void {
  if (p.thickness >= Math.min(p.depth, p.height) / 3) {
    ctx.addIssue({
      code: "custom",
      path: ["thickness"],
      message: "Flange thickness consumes right-angle mounting leg span",
    })
  }
  if (p.ribs * p.ribThickness >= p.width - p.holeDiameter - 8) {
    ctx.addIssue({
      code: "custom",
      path: ["ribThickness"],
      message: "Gusset ribs crowd out mounting bolt clearance",
    })
  }
  if (
    p.baseHolePitch > p.width - p.holeDiameter - 6 ||
    p.wallHolePitch > p.width - p.holeDiameter - 6
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["baseHolePitch"],
      message: "Mounting hole pitch breaks through bracket side edges",
    })
  }
}
