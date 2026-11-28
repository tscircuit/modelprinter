import type { z } from "zod"

export interface HeaderSocketShape {
  pitch: number
  contacts: number
  rows: number
  width: number
  depth: number
  height: number
  tailLength: number
  pinThickness: number
  female: true
  throughHole: true
  vertical: true
}

export function validateHeaderSocketProps(
  p: HeaderSocketShape,
  ctx: z.RefinementCtx,
): void {
  if (p.contacts % p.rows !== 0) {
    ctx.addIssue({
      code: "custom",
      path: ["contacts"],
      message: "Total contact count must be evenly divisible by row count",
    })
  }
  const cols = p.contacts / p.rows
  if (
    p.width < (cols - 1) * p.pitch + 1 ||
    p.depth < (p.rows - 1) * p.pitch + 1
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["width"],
      message: "Insulator housing footprint is narrower than contact grid span",
    })
  }
  if (p.pinThickness >= p.pitch - 0.8) {
    ctx.addIssue({
      code: "custom",
      path: ["pinThickness"],
      message: "Solder tail thickness shorts across contact pitch",
    })
  }
}
