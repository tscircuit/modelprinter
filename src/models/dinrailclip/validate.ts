import type { z } from "zod"

export interface DinRailClipShape {
  th35x75: true
  width: number
  depth: number
  height: number
  thickness: number
  hooks: 2
  holeDiameter: number
  springLeaf: true
}

export function validateDinRailClipProps(
  p: DinRailClipShape,
  ctx: z.RefinementCtx,
): void {
  if (p.depth < 35) {
    ctx.addIssue({
      code: "custom",
      path: ["depth"],
      message: "Clip depth must span a 35 mm TH35x7.5 DIN rail",
    })
  }
  if (p.holeDiameter >= p.width - 4) {
    ctx.addIssue({
      code: "custom",
      path: ["holeDiameter"],
      message: "Mounting hole diameter exceeds spring clip width",
    })
  }
}
