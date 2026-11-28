import type { z } from "zod"

export interface TelescopicSlideShape {
  length: number
  width: number
  height: number
  stages: 2 | 3
  sideHoles: true
  holeDiameter: number
  holePitch: number
  ballRace: true
}

export function validateTelescopicSlideProps(
  p: TelescopicSlideShape,
  ctx: z.RefinementCtx,
): void {
  if (p.holePitch + p.holeDiameter >= p.length) {
    ctx.addIssue({
      code: "custom",
      path: ["holePitch"],
      message: "Side mounting hole pitch exceeds closed slide length",
    })
  }
  if (p.holeDiameter >= p.width - 6) {
    ctx.addIssue({
      code: "custom",
      path: ["holeDiameter"],
      message: "Side mounting hole diameter exceeds slide channel web",
    })
  }
}
