import type { z } from "zod"

export interface DinBoxShape {
  width: number
  depth: number
  height: number
  wallThickness: number
  th35x75: true
  rearLowerClip: true
  topBottomTerminals: true
  screwOnLid: true
}

export function validateDinBoxProps(
  p: DinBoxShape,
  ctx: z.RefinementCtx,
): void {
  if (p.width <= 2 * p.wallThickness + 10) {
    ctx.addIssue({
      code: "custom",
      path: ["width"],
      message: "DIN enclosure width leaves insufficient interior cavity",
    })
  }
  if (p.depth <= 2 * p.wallThickness + 15) {
    ctx.addIssue({
      code: "custom",
      path: ["depth"],
      message: "DIN enclosure depth leaves insufficient rail latch and cavity",
    })
  }
  if (p.height <= 42) {
    ctx.addIssue({
      code: "custom",
      path: ["height"],
      message:
        "Enclosure height must exceed 42 mm to accommodate TH35x7.5 rear rail groove",
    })
  }
}
