import type { z } from "zod"

export interface MultiChannelPanelShape {
  length: number
  width: number
  thickness: number
  skinThickness: number
  webThickness: number
  pitch: number
  channels: number
}

export function validateMultiChannelPanelProps(
  p: MultiChannelPanelShape,
  ctx: z.RefinementCtx,
): void {
  if (2 * p.skinThickness >= p.thickness - 1) {
    ctx.addIssue({
      code: "custom",
      path: ["skinThickness"],
      message: "Outer skins close off internal hollow channels",
    })
  }
  if (p.webThickness >= p.pitch - 1) {
    ctx.addIssue({
      code: "custom",
      path: ["webThickness"],
      message: "Internal partition web thickness closes off channel width",
    })
  }
  if (Math.abs(p.channels * p.pitch - p.width) > p.pitch) {
    ctx.addIssue({
      code: "custom",
      path: ["channels"],
      message: "Channel count times pitch does not match panel width",
    })
  }
}
