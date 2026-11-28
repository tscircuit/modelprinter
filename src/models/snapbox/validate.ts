import type { z } from "zod"

export interface SnapBoxShape {
  width: number
  depth: number
  height: number
  wallThickness: number
  cornerRadius: number
  lidThickness: number
  hooks: 4
  hookWidth: number
  hookDepth: number
  recessLap: number
  snapLid: true
}

export function validateSnapBoxProps(
  p: SnapBoxShape,
  ctx: z.RefinementCtx,
): void {
  const minFlatSpan =
    Math.min(p.width, p.depth) - 2 * Math.max(p.wallThickness, p.cornerRadius)
  if (p.hookWidth >= minFlatSpan) {
    ctx.addIssue({
      code: "custom",
      path: ["hookWidth"],
      message:
        "Snap hook width must fit within the flat interior side-wall span",
    })
  }
  if (p.hookDepth > p.wallThickness) {
    ctx.addIssue({
      code: "custom",
      path: ["hookDepth"],
      message: "Snap hook undercut depth cannot exceed shell wall thickness",
    })
  }
  if (p.lidThickness + p.recessLap >= p.height * 0.5) {
    ctx.addIssue({
      code: "custom",
      path: ["recessLap"],
      message: "Recessed lid thickness and lap must leave interior box depth",
    })
  }
}
