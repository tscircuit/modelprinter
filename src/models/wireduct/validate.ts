import type { z } from "zod"

export interface WireDuctShape {
  innerWidth: number
  innerHeight: number
  length: number
  wallThickness: number
  slots: number
  slotWidth: number
  slotPitch: number
  slotHeight: number
  holes: number
  holeDiameter: number
  holePitch: number
}

export function validateWireDuctProps(
  p: WireDuctShape,
  ctx: z.RefinementCtx,
): void {
  if (p.slotWidth >= p.slotPitch - 1) {
    ctx.addIssue({
      code: "custom",
      path: ["slotWidth"],
      message: "Finger slot width leaves insufficient comb finger web",
    })
  }
  if ((p.slots - 1) * p.slotPitch + p.slotWidth > p.length - 4) {
    ctx.addIssue({
      code: "custom",
      path: ["slots"],
      message: "Slotted sidewall finger array exceeds wiring duct length",
    })
  }
  if (p.slotHeight >= p.innerHeight - 2) {
    ctx.addIssue({
      code: "custom",
      path: ["slotHeight"],
      message: "Vertical finger slot height breaks into lower duct base",
    })
  }
  if (p.holePitch + p.holeDiameter > p.length - 4) {
    ctx.addIssue({
      code: "custom",
      path: ["holePitch"],
      message: "Floor fixing hole pitch exceeds duct length",
    })
  }
}
