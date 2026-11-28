import type { z } from "zod"

export interface RockerSwitchShape {
  cutoutLength: number
  cutoutWidth: number
  bodyDepth: number
  flangeBorder: number
  curvedRocker: true
  clips: 2
  contacts: 2 | 3
  tabWidth: number
  tabThickness: number
}

export function validateRockerSwitchProps(
  p: RockerSwitchShape,
  ctx: z.RefinementCtx,
): void {
  if (p.tabWidth >= p.cutoutWidth - 2) {
    ctx.addIssue({
      code: "custom",
      path: ["tabWidth"],
      message: "Rear quick-connect blade width exceeds switch housing width",
    })
  }
  if (p.contacts * p.tabThickness * 2 >= p.cutoutLength) {
    ctx.addIssue({
      code: "custom",
      path: ["contacts"],
      message: "Quick-connect blades cannot fit along switch cutout length",
    })
  }
}
