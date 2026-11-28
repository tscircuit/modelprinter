import type { z } from "zod"

export interface ElevatorBoltShape {
  custom: true
  thread: string
  length: number
  threadLength: number
  headOuterDiameter: number
  headHeight: number
  flatHead: true
  squareNeck: true
  neckWidth: number
  neckLength: number
}

export function validateElevatorBoltProps(
  p: ElevatorBoltShape,
  ctx: z.RefinementCtx,
): void {
  const majorDia = Number(p.thread.slice(1))
  if (p.neckLength + p.threadLength > p.length) {
    ctx.addIssue({
      code: "custom",
      path: ["threadLength"],
      message: "Square neck length plus thread length exceeds shank length",
    })
  }
  if (p.headOuterDiameter <= 2 * majorDia) {
    ctx.addIssue({
      code: "custom",
      path: ["headOuterDiameter"],
      message:
        "Elevator bolt wide disk head OD must exceed 2 * thread diameter",
    })
  }
  if (p.neckWidth * Math.SQRT2 >= p.headOuterDiameter) {
    ctx.addIssue({
      code: "custom",
      path: ["neckWidth"],
      message: "Square anti-rotation neck corners must fit inside disk head OD",
    })
  }
}
