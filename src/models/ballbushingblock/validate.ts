import type { z } from "zod"

export interface BallBushingBlockShape {
  boreDiameter: number
  length: number
  width: number
  height: number
  closedRecirculating: true
  top4Hole: true
  holeGridX: number
  holeGridY: number
  thread: string
}

export function validateBallBushingBlockProps(
  p: BallBushingBlockShape,
  ctx: z.RefinementCtx,
): void {
  const threadDia = Number(p.thread.slice(1))
  if (p.boreDiameter >= p.width - 4 || p.boreDiameter >= p.height - 2) {
    ctx.addIssue({
      code: "custom",
      path: ["boreDiameter"],
      message: "Shaft bore exceeds linear bushing block cross-section",
    })
  }
  if (p.holeGridX + threadDia >= p.length) {
    ctx.addIssue({
      code: "custom",
      path: ["holeGridX"],
      message: "Axial mounting hole pitch exceeds block length",
    })
  }
  if (p.holeGridY + threadDia >= p.width) {
    ctx.addIssue({
      code: "custom",
      path: ["holeGridY"],
      message: "Transverse mounting hole pitch exceeds block width",
    })
  }
}
