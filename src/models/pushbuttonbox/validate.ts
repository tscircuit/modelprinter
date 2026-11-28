import type { z } from "zod"

export interface PushbuttonBoxShape {
  width: number
  depth: number
  height: number
  wallThickness: number
  cornerRadius: number
  lidThickness: number
  cutoutDiameter: number
  screwOnLid: true
  screws: number
  holePitchX: number
  holePitchY: number
}

export function validatePushbuttonBoxProps(
  p: PushbuttonBoxShape,
  ctx: z.RefinementCtx,
): void {
  if (p.holePitchX >= p.width - 2 * p.wallThickness) {
    ctx.addIssue({
      code: "custom",
      path: ["holePitchX"],
      message: "Cover screw X pitch exceeds pushbutton box interior width",
    })
  }
  if (p.holePitchY >= p.depth - 2 * p.wallThickness) {
    ctx.addIssue({
      code: "custom",
      path: ["holePitchY"],
      message: "Cover screw Y pitch exceeds pushbutton box interior depth",
    })
  }
  if (p.cutoutDiameter >= Math.min(p.holePitchX, p.holePitchY) - 6) {
    ctx.addIssue({
      code: "custom",
      path: ["cutoutDiameter"],
      message: "Actuator cutout collides with corner cover screw bosses",
    })
  }
}
