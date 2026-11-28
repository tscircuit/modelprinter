import type { z } from "zod"

export interface MasterChainLinkShape {
  pitch: number
  width: number
  pinDiameter: number
  springClip: true
  innerWidth: number
}

export function validateMasterChainLinkProps(
  p: MasterChainLinkShape,
  ctx: z.RefinementCtx,
): void {
  if (p.innerWidth >= p.width - 2) {
    ctx.addIssue({
      code: "custom",
      path: ["innerWidth"],
      message: "Inner roller span must be narrower than overall pin width",
    })
  }
  if (p.pinDiameter >= p.pitch * 0.6) {
    ctx.addIssue({
      code: "custom",
      path: ["pinDiameter"],
      message: "Connecting pin diameter exceeds valid chain pitch proportion",
    })
  }
}
