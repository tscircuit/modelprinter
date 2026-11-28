import type { z } from "zod"

export interface ChannelNutShape {
  threadDiameter: number
  width: number
  length: number
  height: number
  grooves: number
  grooveWidth: number
  grooveDepth: number
  springOuterDiameter: number
  springLength: number
  springWireDiameter: number
}

export function validateChannelNutProps(
  p: ChannelNutShape,
  ctx: z.RefinementCtx,
): void {
  if (p.threadDiameter >= p.width - 2 * p.grooveWidth - 2) {
    ctx.addIssue({
      code: "custom",
      path: ["threadDiameter"],
      message: "Thread bore collides with strut-lip serrated grooves",
    })
  }
  if (p.grooveDepth >= p.height - 2) {
    ctx.addIssue({
      code: "custom",
      path: ["grooveDepth"],
      message: "Lip groove depth cuts through channel nut thickness",
    })
  }
  if (
    p.springOuterDiameter >= p.width - 2 ||
    2 * p.springWireDiameter >= p.springOuterDiameter - 2
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["springOuterDiameter"],
      message: "Positioning spring dimensions exceed channel nut base",
    })
  }
}
