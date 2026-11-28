import type { z } from "zod"

export interface SpringPlungerShape {
  custom: true
  thread: string
  length: number
  pinDiameter: number
  projection: number
  stroke: number
  roundTip: true
  slottedRear: true
  slotWidth: number
  slotDepth: number
  extended: true
}

export function validateSpringPlungerProps(
  p: SpringPlungerShape,
  ctx: z.RefinementCtx,
): void {
  const majorDia = Number(p.thread.slice(1))
  if (p.pinDiameter >= majorDia - 1) {
    ctx.addIssue({
      code: "custom",
      path: ["pinDiameter"],
      message: "Plunger pin diameter must fit inside threaded barrel core",
    })
  }
  if (p.stroke > p.projection) {
    ctx.addIssue({
      code: "custom",
      path: ["stroke"],
      message: "Axial plunger stroke cannot exceed extended pin projection",
    })
  }
  if (p.projection >= p.length) {
    ctx.addIssue({
      code: "custom",
      path: ["projection"],
      message: "Plunger pin projection must be shorter than barrel length",
    })
  }
  if (p.slotWidth >= majorDia - 1) {
    ctx.addIssue({
      code: "custom",
      path: ["slotWidth"],
      message: "Rear drive slot width exceeds barrel thread diameter",
    })
  }
}
