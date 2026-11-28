import type { z } from "zod"

export interface JackScrewShape {
  custom: true
  thread: string
  length: number
  fullThread: true
  headAcrossFlats: number
  headHeight: number
  padOuterDiameter: number
  padHeight: number
  ballJoint: true
  ballDiameter: number
}

export function validateJackScrewProps(
  p: JackScrewShape,
  ctx: z.RefinementCtx,
): void {
  const majorDia = Number(p.thread.slice(1))
  if (p.headAcrossFlats <= majorDia) {
    ctx.addIssue({
      code: "custom",
      path: ["headAcrossFlats"],
      message: "Hex drive collar across-flats must exceed thread diameter",
    })
  }
  if (p.ballDiameter >= majorDia || p.ballDiameter >= p.padOuterDiameter - 2) {
    ctx.addIssue({
      code: "custom",
      path: ["ballDiameter"],
      message: "Swivel ball diameter must fit inside screw root and swivel pad",
    })
  }
}
