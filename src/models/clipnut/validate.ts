import type { z } from "zod"

export interface ClipNutShape {
  threadDiameter: number
  width: number
  length: number
  panelGap: number
  stripThickness: number
  holeOffset: number
  barrelOuterDiameter: number
  barrelHeight: number
  uForm: true
}

export function validateClipNutProps(
  p: ClipNutShape,
  ctx: z.RefinementCtx,
): void {
  if (p.threadDiameter >= p.barrelOuterDiameter - 0.8) {
    ctx.addIssue({
      code: "custom",
      path: ["threadDiameter"],
      message: "Thread diameter exceeds extruded barrel wall",
    })
  }
  if (p.barrelOuterDiameter >= p.width - 2) {
    ctx.addIssue({
      code: "custom",
      path: ["barrelOuterDiameter"],
      message: "Extruded barrel diameter exceeds U-clip leg width",
    })
  }
  if (
    p.holeOffset <= p.barrelOuterDiameter / 2 + 1 ||
    p.holeOffset >= p.length - p.barrelOuterDiameter / 2 - 1
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["holeOffset"],
      message: "Hole throat offset breaks through clip fold or tip",
    })
  }
}
