import type { z } from "zod"

export interface SquareNutShape {
  custom: true
  thread: string
  width: number
  height: number
  squareBody: true
  throughBore: true
  chamfer: number
}

export function validateSquareNutProps(
  p: SquareNutShape,
  ctx: z.RefinementCtx,
): void {
  const majorDia = Number(p.thread.slice(1))
  if (p.width <= majorDia + 2) {
    ctx.addIssue({
      code: "custom",
      path: ["width"],
      message: "Square nut across-flats width must exceed thread OD by >2 mm",
    })
  }
  if (2 * p.chamfer >= p.height) {
    ctx.addIssue({
      code: "custom",
      path: ["chamfer"],
      message: "Upper and lower edge chamfers consume nut height",
    })
  }
}
