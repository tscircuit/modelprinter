import type { z } from "zod"

export interface GasketBoxShape {
  width: number
  depth: number
  height: number
  wallThickness: number
  cornerRadius: number
  lidThickness: number
  grooveWidth: number
  grooveDepth: number
  lidScrews: 4
  holePitchX: number
  holePitchY: number
  screwOnLid: true
}

export function validateGasketBoxProps(
  p: GasketBoxShape,
  ctx: z.RefinementCtx,
): void {
  if (p.lidThickness >= p.height * 0.4) {
    ctx.addIssue({
      code: "custom",
      path: ["lidThickness"],
      message:
        "Lid thickness must remain smaller than 40% of overall box height",
    })
  }
  if (p.grooveDepth >= p.height - p.lidThickness - p.wallThickness) {
    ctx.addIssue({
      code: "custom",
      path: ["grooveDepth"],
      message: "Sealing groove depth must fit inside the upper perimeter rim",
    })
  }
  if (p.grooveWidth + 2 * p.wallThickness >= Math.min(p.width, p.depth) * 0.5) {
    ctx.addIssue({
      code: "custom",
      path: ["grooveWidth"],
      message:
        "Perimeter sealing groove rim must leave a clear interior cavity",
    })
  }
  if (
    p.holePitchX >= p.width - 2 * p.wallThickness ||
    p.holePitchY >= p.depth - 2 * p.wallThickness
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["holePitchX"],
      message: "Corner screw pitch must stay inside the enclosure outer walls",
    })
  }
}
