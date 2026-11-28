import type { z } from "zod"

export interface FlatBeltShape {
  pitchLength: number
  width: number
  thickness: number
  endless: true
  rectangular: true
}

export function validateFlatBeltProps(
  p: FlatBeltShape,
  ctx: z.RefinementCtx,
): void {
  if (p.thickness >= p.width) {
    ctx.addIssue({
      code: "custom",
      path: ["thickness"],
      message: "Flat belt thickness must be smaller than belt width",
    })
  }
  if (p.pitchLength <= Math.PI * p.thickness * 10) {
    ctx.addIssue({
      code: "custom",
      path: ["pitchLength"],
      message: "Endless flat belt pitch length is too short for belt thickness",
    })
  }
}
