import type { z } from "zod"

export interface HammerDriveAnchorShape {
  outerDiameter: number
  length: number
  headOuterDiameter: number
  headHeight: number
  pinDiameter: number
  pinExposed: number
  slots: number
  slotLength: number
  unset: true
}

export function validateHammerDriveAnchorProps(
  p: HammerDriveAnchorShape,
  ctx: z.RefinementCtx,
): void {
  if (
    p.pinDiameter >= p.outerDiameter - 2 ||
    p.outerDiameter >= p.headOuterDiameter - 2
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["pinDiameter"],
      message:
        "Hammer-drive anchor requires ordered drive pin, shank, and mushroom head diameters",
    })
  }
  if (p.slotLength >= p.length - p.headHeight - 5) {
    ctx.addIssue({
      code: "custom",
      path: ["slotLength"],
      message: "Lower expansion slot length exceeds anchor shank length",
    })
  }
}
