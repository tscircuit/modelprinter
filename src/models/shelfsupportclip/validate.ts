import type { z } from "zod"

export interface ShelfSupportClipShape {
  height: number
  width: number
  length: number
  thickness: number
  hooks: number
  hookPitch: number
  hookWidth: number
  hookHeight: number
  hookDepth: number
  throat: number
  ledgeLength: number
}

export function validateShelfSupportClipProps(
  p: ShelfSupportClipShape,
  ctx: z.RefinementCtx,
): void {
  if (p.hookPitch >= p.height - p.hookHeight - 2) {
    ctx.addIssue({
      code: "custom",
      path: ["hookPitch"],
      message: "Rear insertion hook pitch exceeds clip backplate height",
    })
  }
  if (p.ledgeLength > p.length || p.hookWidth >= p.width - 4) {
    ctx.addIssue({
      code: "custom",
      path: ["ledgeLength"],
      message: "Ledge length or hook width exceeds clip envelope",
    })
  }
}
