import type { z } from "zod"

export interface SquareHeadBoltShape {
  custom: true
  thread: string
  length: number
  threadLength: number
  headWidth: number
  headHeight: number
  squareHead: true
  squareDrive: true
  chamfer: number
}

export function validateSquareHeadBoltProps(
  p: SquareHeadBoltShape,
  ctx: z.RefinementCtx,
): void {
  const majorDia = Number(p.thread.slice(1))
  if (p.threadLength > p.length) {
    ctx.addIssue({
      code: "custom",
      path: ["threadLength"],
      message: "Thread length cannot exceed under-head shank length",
    })
  }
  if (p.headWidth <= majorDia) {
    ctx.addIssue({
      code: "custom",
      path: ["headWidth"],
      message: "Square wrench head width must exceed thread major diameter",
    })
  }
  if (p.chamfer >= p.headHeight || 2 * p.chamfer >= p.headWidth) {
    ctx.addIssue({
      code: "custom",
      path: ["chamfer"],
      message: "Top head chamfer consumes head height or across-flats width",
    })
  }
}
