import type { z } from "zod"

export interface SexBoltShape {
  custom: true
  thread: string
  barrelOuterDiameter: number
  barrelLength: number
  flangeOuterDiameter: number
  flangeHeight: number
  screwLength: number
  slotted: true
  slotWidth: number
  slotDepth: number
}

export function validateSexBoltProps(
  p: SexBoltShape,
  ctx: z.RefinementCtx,
): void {
  const majorDia = Number(p.thread.slice(1))
  if (p.barrelOuterDiameter <= majorDia + 1) {
    ctx.addIssue({
      code: "custom",
      path: ["barrelOuterDiameter"],
      message: "Female barrel OD leaves insufficient internal thread wall",
    })
  }
  if (p.flangeOuterDiameter <= p.barrelOuterDiameter) {
    ctx.addIssue({
      code: "custom",
      path: ["flangeOuterDiameter"],
      message: "Head flange diameter must exceed barrel diameter",
    })
  }
  if (p.screwLength >= p.barrelLength) {
    ctx.addIssue({
      code: "custom",
      path: ["screwLength"],
      message: "Mating screw length must fit inside female barrel length",
    })
  }
  if (p.slotDepth >= p.flangeHeight) {
    ctx.addIssue({
      code: "custom",
      path: ["slotDepth"],
      message: "Driver slot depth must be smaller than flange head height",
    })
  }
}
