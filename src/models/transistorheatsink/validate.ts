import type { z } from "zod"

export interface TransistorHeatsinkShape {
  width: number
  height: number
  depth: number
  thickness: number
  uShapedWings: true
  deviceHoleDiameter: number
  holeZ: number
  tabs: 2
  tabHoleDiameter: number
  holePitch: number
}

export function validateTransistorHeatsinkProps(
  p: TransistorHeatsinkShape,
  ctx: z.RefinementCtx,
): void {
  if (p.thickness * 2 >= Math.min(p.width, p.depth) - 4) {
    ctx.addIssue({
      code: "custom",
      path: ["thickness"],
      message: "Stamped sheet thickness leaves insufficient U-wing channel",
    })
  }
  if (
    p.holeZ <= p.deviceHoleDiameter / 2 ||
    p.holeZ >= p.height - p.deviceHoleDiameter / 2
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["holeZ"],
      message: "Device mounting hole Z height lies outside backplate height",
    })
  }
  if (p.holePitch + p.tabHoleDiameter >= p.width) {
    ctx.addIssue({
      code: "custom",
      path: ["holePitch"],
      message: "Board mounting tab hole pitch exceeds heatsink width",
    })
  }
}
