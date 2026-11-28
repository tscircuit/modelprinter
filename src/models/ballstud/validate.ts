import type { z } from "zod"

export interface BallStudShape {
  custom: true
  thread: string
  threadLength: number
  ballDiameter: number
  neckDiameter: number
  neckLength: number
  shoulderAcrossFlats: number
  shoulderHeight: number
  fullThread: true
}

export function validateBallStudProps(
  p: BallStudShape,
  ctx: z.RefinementCtx,
): void {
  const majorDia = Number(p.thread.slice(1))
  if (p.neckDiameter >= p.ballDiameter - 1) {
    ctx.addIssue({
      code: "custom",
      path: ["neckDiameter"],
      message: "Articulation neck diameter must be smaller than ball head",
    })
  }
  if (p.shoulderAcrossFlats <= majorDia) {
    ctx.addIssue({
      code: "custom",
      path: ["shoulderAcrossFlats"],
      message: "Hex wrench shoulder across-flats must exceed thread diameter",
    })
  }
}
