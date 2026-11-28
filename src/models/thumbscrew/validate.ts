import type { z } from "zod"

export interface ThumbScrewShape {
  custom: true
  thread: string
  length: number
  headOuterDiameter: number
  headHeight: number
  straightKnurl: true
  knurlPitch: number
  fullThread: true
  chamferTip: true
}

export function validateThumbScrewProps(
  p: ThumbScrewShape,
  ctx: z.RefinementCtx,
): void {
  const nominalDia = Number(p.thread.slice(1))
  if (p.headOuterDiameter <= nominalDia + 2) {
    ctx.addIssue({
      code: "custom",
      path: ["headOuterDiameter"],
      message:
        "Knurled thumb head diameter must exceed thread diameter by >2 mm",
    })
  }
  if (p.knurlPitch >= (Math.PI * p.headOuterDiameter) / 8) {
    ctx.addIssue({
      code: "custom",
      path: ["knurlPitch"],
      message: "Knurl pitch is too coarse for head circumference",
    })
  }
}
