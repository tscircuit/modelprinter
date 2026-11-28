import type { z } from "zod"

export interface DrawLatchShape {
  width: number
  length: number
  height: number
  sheetThickness: number
  loopWireDiameter: number
  catchWidth: number
  holeDiameter: number
  holePitchX: number
  holePitchY: number
  overCenter: true
}

export function validateDrawLatchProps(
  p: DrawLatchShape,
  ctx: z.RefinementCtx,
): void {
  if (p.catchWidth > p.width) {
    ctx.addIssue({
      code: "custom",
      path: ["catchWidth"],
      message: "Keeper catch width cannot exceed the overall latch width",
    })
  }
  if (p.holePitchX + p.holeDiameter >= p.width) {
    ctx.addIssue({
      code: "custom",
      path: ["holePitchX"],
      message:
        "Lateral mounting hole pitch plus hole diameter must fit inside width",
    })
  }
  if (p.holePitchY + p.holeDiameter >= p.length) {
    ctx.addIssue({
      code: "custom",
      path: ["holePitchY"],
      message:
        "Longitudinal mounting hole pitch plus hole diameter must fit inside length",
    })
  }
  if (p.sheetThickness * 2 >= p.height) {
    ctx.addIssue({
      code: "custom",
      path: ["sheetThickness"],
      message:
        "Stamped sheet thickness must leave clearance inside closed latch height",
    })
  }
}
