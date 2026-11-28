import type { z } from "zod"

export interface ThreadRollingScrewShape {
  custom: true
  thread: string
  length: number
  panHead: true
  headOuterDiameter: number
  headHeight: number
  phillips: true
  trilobular: true
  lobes: number
  lobingOffset: number
  leadLength: number
  taperTip: true
}

export function validateThreadRollingScrewProps(
  p: ThreadRollingScrewShape,
  ctx: z.RefinementCtx,
): void {
  const majorDia = Number(p.thread.slice(1))
  if (p.headOuterDiameter <= majorDia) {
    ctx.addIssue({
      code: "custom",
      path: ["headOuterDiameter"],
      message: "Pan head OD must exceed nominal trilobular major diameter",
    })
  }
  if (p.lobingOffset >= majorDia * 0.2) {
    ctx.addIssue({
      code: "custom",
      path: ["lobingOffset"],
      message: "Trilobular radial lobing offset exceeds 20% of thread diameter",
    })
  }
  if (p.leadLength >= p.length) {
    ctx.addIssue({
      code: "custom",
      path: ["leadLength"],
      message: "Tapered lead length must be shorter than total screw length",
    })
  }
}
