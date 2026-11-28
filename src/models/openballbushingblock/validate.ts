import type { z } from "zod"

export interface OpenBallBushingBlockShape {
  boreDiameter: number
  length: number
  width: number
  height: number
  openRecirculating: true
  top4Hole: true
  holeGridX: number
  holeGridY: number
  thread: string
}

export function validateOpenBallBushingBlockProps(
  p: OpenBallBushingBlockShape,
  ctx: z.RefinementCtx,
): void {
  const threadDia = Number(p.thread.slice(1))
  if (p.boreDiameter >= p.width - 6 || p.boreDiameter >= p.height - 4) {
    ctx.addIssue({
      code: "custom",
      path: ["boreDiameter"],
      message: "Shaft bore exceeds open bushing pillow-block envelope",
    })
  }
  if (p.holeGridX + threadDia >= p.length) {
    ctx.addIssue({
      code: "custom",
      path: ["holeGridX"],
      message: "Axial top mounting hole pitch exceeds block length",
    })
  }
  if (p.holeGridY + threadDia >= p.width) {
    ctx.addIssue({
      code: "custom",
      path: ["holeGridY"],
      message: "Transverse top mounting hole pitch exceeds block width",
    })
  }
}
