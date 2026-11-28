import type { z } from "zod"

export interface WireMeshShape {
  length: number
  width: number
  wireDiameter: number
  pitchX: number
  pitchY: number
  weaveStyle: "plainweave" | "twillweave"
  edgeStyle: "uncapped" | "framededge"
}

export function validateWireMeshProps(
  p: WireMeshShape,
  ctx: z.RefinementCtx,
): void {
  if (p.wireDiameter >= Math.min(p.pitchX, p.pitchY) * 0.6) {
    ctx.addIssue({
      code: "custom",
      path: ["wireDiameter"],
      message: "Wire diameter closes off woven mesh aperture",
    })
  }
  if (p.pitchX > p.length / 2 || p.pitchY > p.width / 2) {
    ctx.addIssue({
      code: "custom",
      path: ["pitchX"],
      message: "Mesh strand pitch exceeds half panel span",
    })
  }
}
