import type { z } from "zod"

export interface LeafSpringShape {
  custom: true
  width: number
  arcLength: number
  thickness: number
  radius: number
  circularArc: true
  squareEnds: true
  freeState: true
}

export function validateLeafSpringProps(
  p: LeafSpringShape,
  ctx: z.RefinementCtx,
): void {
  if (p.thickness >= p.radius * 0.25) {
    ctx.addIssue({
      code: "custom",
      path: ["thickness"],
      message: "Leaf thickness must remain small relative to bend radius",
    })
  }
  if (p.arcLength >= Math.PI * p.radius) {
    ctx.addIssue({
      code: "custom",
      path: ["arcLength"],
      message: "Circular-arc leaf length must stay shorter than a semicircle",
    })
  }
}
