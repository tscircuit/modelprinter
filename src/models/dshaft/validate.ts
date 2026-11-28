import type { z } from "zod"

export interface DShaftShape {
  diameter: number
  length: number
  flatDistance: number
  flatLength: number
  endChamfer: number
}

export function validateDShaftProps(
  p: DShaftShape,
  ctx: z.RefinementCtx,
): void {
  const radius = p.diameter / 2
  if (p.flatDistance >= radius) {
    ctx.addIssue({
      code: "custom",
      path: ["flatDistance"],
      message:
        "Drive flat distance from shaft axis must be less than shaft radius",
    })
  }
  if (p.flatLength > p.length) {
    ctx.addIssue({
      code: "custom",
      path: ["flatLength"],
      message: "Drive flat length cannot exceed total shaft length",
    })
  }
  if (2 * p.endChamfer >= p.length || p.endChamfer >= radius) {
    ctx.addIssue({
      code: "custom",
      path: ["endChamfer"],
      message: "End chamfers must leave positive shaft body and end face",
    })
  }
}
