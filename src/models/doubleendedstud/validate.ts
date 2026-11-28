import type { z } from "zod"

export interface DoubleEndedStudShape {
  custom: true
  thread: string
  length: number
  threadLength: number
  equalEnds: true
  smoothMiddle: true
  chamferTip: true
  chamfer: number
}

export function validateDoubleEndedStudProps(
  p: DoubleEndedStudShape,
  ctx: z.RefinementCtx,
): void {
  const majorDia = Number(p.thread.slice(1))
  if (2 * p.threadLength >= p.length) {
    ctx.addIssue({
      code: "custom",
      path: ["threadLength"],
      message:
        "Two equal threaded ends must leave a positive unthreaded smooth middle",
    })
  }
  if (p.chamfer >= majorDia / 2) {
    ctx.addIssue({
      code: "custom",
      path: ["chamfer"],
      message: "Terminal tip chamfer cannot consume the stud radius",
    })
  }
}
