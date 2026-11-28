import type { z } from "zod"

export interface WireRopeClipShape {
  ropeDiameter: number
  uBoltDiameter: number
  threadDiameter: number
  legPitch: number
  legLength: number
  saddleWidth: number
  saddleLength: number
  saddleHeight: number
  grooveRadius: number
  hexNuts: true
  assembled: true
}

export function validateWireRopeClipProps(
  p: WireRopeClipShape,
  ctx: z.RefinementCtx,
): void {
  if (p.ropeDiameter >= p.legPitch - p.uBoltDiameter - 2) {
    ctx.addIssue({
      code: "custom",
      path: ["legPitch"],
      message: "U-bolt leg pitch pinches wire rope diameter",
    })
  }
  if (p.legPitch + p.uBoltDiameter > p.saddleWidth) {
    ctx.addIssue({
      code: "custom",
      path: ["saddleWidth"],
      message: "U-bolt legs overhang forged saddle width",
    })
  }
  if (p.grooveRadius >= p.saddleHeight - 2) {
    ctx.addIssue({
      code: "custom",
      path: ["grooveRadius"],
      message: "Cable groove cuts through forged saddle bridge",
    })
  }
}
