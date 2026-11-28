import type { z } from "zod"

export interface SnapClipShape {
  standoffHeight: number
  baseOuterDiameter: number
  stemDiameter: number
  boardThickness: number
  barbOuterDiameter: number
  splitArrow: true
  screwFoot: true
  screwDiameter: number
}

export function validateSnapClipProps(
  p: SnapClipShape,
  ctx: z.RefinementCtx,
): void {
  if (p.barbOuterDiameter <= p.stemDiameter) {
    ctx.addIssue({
      code: "custom",
      path: ["barbOuterDiameter"],
      message:
        "Split-arrow barb diameter must exceed the support stem diameter",
    })
  }
  if (p.baseOuterDiameter <= p.stemDiameter) {
    ctx.addIssue({
      code: "custom",
      path: ["baseOuterDiameter"],
      message: "Round mounting base diameter must exceed the stem diameter",
    })
  }
  if (p.screwDiameter >= p.baseOuterDiameter * 0.75) {
    ctx.addIssue({
      code: "custom",
      path: ["screwDiameter"],
      message: "Mounting screw bore must fit inside the round base flange",
    })
  }
  if (p.boardThickness >= p.standoffHeight) {
    ctx.addIssue({
      code: "custom",
      path: ["boardThickness"],
      message: "Supported board thickness must be smaller than standoff height",
    })
  }
}
