import type { z } from "zod"

export interface HeatsinkClipShape {
  width: number
  length: number
  height: number
  stripThickness: number
  hookDepth: number
  springBridge: true
}

export function validateHeatsinkClipProps(
  p: HeatsinkClipShape,
  ctx: z.RefinementCtx,
): void {
  if (p.stripThickness >= p.hookDepth || p.hookDepth >= p.height - 2) {
    ctx.addIssue({
      code: "custom",
      path: ["hookDepth"],
      message:
        "Retention hook depth must fit between strip thickness and arch height",
    })
  }
  if (p.width >= p.length - 8) {
    ctx.addIssue({
      code: "custom",
      path: ["width"],
      message: "Bridge strap width exceeds span length between retention hooks",
    })
  }
}
