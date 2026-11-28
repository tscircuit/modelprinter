import type { z } from "zod"

export interface ThreadCuttingScrewShape {
  custom: true
  thread: string
  length: number
  fullThread: true
  panHead: true
  headOuterDiameter: number
  headHeight: number
  phillips: true
  flutes: number
  fluteLength: number
  fluteWidth: number
  fluteDepth: number
}

export function validateThreadCuttingScrewProps(
  p: ThreadCuttingScrewShape,
  ctx: z.RefinementCtx,
): void {
  const majorDia = Number(p.thread.slice(1))
  if (p.headOuterDiameter <= majorDia) {
    ctx.addIssue({
      code: "custom",
      path: ["headOuterDiameter"],
      message: "Pan head diameter must exceed nominal thread diameter",
    })
  }
  if (p.fluteLength >= p.length) {
    ctx.addIssue({
      code: "custom",
      path: ["fluteLength"],
      message: "Tip cutting flutes must be shorter than under-head length",
    })
  }
  if (p.fluteDepth >= majorDia / 3) {
    ctx.addIssue({
      code: "custom",
      path: ["fluteDepth"],
      message: "Cutting flute depth weakens root core excessively",
    })
  }
  if (p.flutes * p.fluteWidth >= Math.PI * majorDia * 0.7) {
    ctx.addIssue({
      code: "custom",
      path: ["fluteWidth"],
      message: "Total flute widths consume thread circumference",
    })
  }
}
