import type { z } from "zod"

export interface SpringDetentShape {
  custom: true
  thread: string
  length: number
  ballDiameter: number
  projection: number
  flatFront: true
  slottedRear: true
  slotWidth: number
  slotDepth: number
}

export function validateSpringDetentProps(
  p: SpringDetentShape,
  ctx: z.RefinementCtx,
): void {
  const majorDia = Number(p.thread.slice(1))
  if (p.ballDiameter >= majorDia - 1) {
    ctx.addIssue({
      code: "custom",
      path: ["ballDiameter"],
      message: "Detent ball diameter must fit inside threaded barrel core",
    })
  }
  if (p.projection >= p.ballDiameter * 0.5) {
    ctx.addIssue({
      code: "custom",
      path: ["projection"],
      message: "Ball projection must be less than ball radius for retention",
    })
  }
  if (p.slotWidth >= majorDia - 1) {
    ctx.addIssue({
      code: "custom",
      path: ["slotWidth"],
      message: "Rear screwdriver slot width exceeds barrel diameter",
    })
  }
  if (p.slotDepth >= p.length * 0.5) {
    ctx.addIssue({
      code: "custom",
      path: ["slotDepth"],
      message: "Rear screwdriver slot depth encroaches on spring pocket",
    })
  }
}
