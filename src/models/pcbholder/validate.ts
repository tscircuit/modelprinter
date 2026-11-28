import type { z } from "zod"

export interface PcbHolderShape {
  boardSpan: number
  height: number
  jawWidth: number
  grooveWidth: number
  grooveDepth: number
  baseLength: number
  baseWidth: number
  mounts: number
  holeDiameter: number
  pitchX: number
  pitchY: number
}

export function validatePcbHolderProps(
  p: PcbHolderShape,
  ctx: z.RefinementCtx,
): void {
  if (p.boardSpan + 2 * (p.jawWidth - p.grooveDepth) > p.baseLength) {
    ctx.addIssue({
      code: "custom",
      path: ["boardSpan"],
      message: "Opposed PCB jaw pillars exceed mounting base length",
    })
  }
  if (p.grooveDepth >= p.jawWidth - 2 || p.grooveWidth >= p.height / 4) {
    ctx.addIssue({
      code: "custom",
      path: ["grooveDepth"],
      message: "PCB edge groove breaks through jaw pillar",
    })
  }
  if (
    p.pitchX + p.holeDiameter > p.baseLength - 4 ||
    p.pitchY + p.holeDiameter > p.baseWidth - 4
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["pitchX"],
      message: "Base mounting holes break through holder baseplate",
    })
  }
}
