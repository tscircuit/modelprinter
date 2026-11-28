import type { z } from "zod"

export interface CoilInsertShape {
  custom: true
  thread: string
  length: number
  outerDiameter: number
  turns: number
  diamond: true
  wireWidth: number
  bentTang: true
  sectionAngle: number
}

export function validateCoilInsertProps(
  p: CoilInsertShape,
  ctx: z.RefinementCtx,
): void {
  const nominalDiameter = Number(p.thread.slice(1))
  if (p.outerDiameter <= nominalDiameter) {
    ctx.addIssue({
      code: "custom",
      path: ["outerDiameter"],
      message:
        "Free coil outer diameter must exceed nominal metric thread diameter",
    })
  }
  if (p.wireWidth >= p.outerDiameter - nominalDiameter) {
    ctx.addIssue({
      code: "custom",
      path: ["wireWidth"],
      message: "Diamond wire width exceeds radial coil wall",
    })
  }
  if (p.turns * p.wireWidth > p.length + 1e-6) {
    ctx.addIssue({
      code: "custom",
      path: ["turns"],
      message: "Close-wound wire turns exceed installed coil length",
    })
  }
}
