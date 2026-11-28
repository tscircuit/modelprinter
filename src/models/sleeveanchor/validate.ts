import type { z } from "zod"

export interface SleeveAnchorShape {
  threadDiameter: number
  length: number
  sleeveOuterDiameter: number
  wallThickness: number
  sleeveLength: number
  slots: number
  slotLength: number
  coneOuterDiameter: number
  acrossFlats: number
  hexHead: true
  unset: true
}

export function validateSleeveAnchorProps(
  p: SleeveAnchorShape,
  ctx: z.RefinementCtx,
): void {
  if (p.threadDiameter >= p.sleeveOuterDiameter - p.wallThickness) {
    ctx.addIssue({
      code: "custom",
      path: ["sleeveOuterDiameter"],
      message: "Expansion sleeve outer diameter cannot enclose threaded bolt",
    })
  }
  if (p.slotLength >= p.sleeveLength - 5 || p.sleeveLength >= p.length - 5) {
    ctx.addIssue({
      code: "custom",
      path: ["sleeveLength"],
      message: "Expansion sleeve or slot length exceeds anchor bolt span",
    })
  }
}
