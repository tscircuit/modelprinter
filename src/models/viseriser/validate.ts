import type { z } from "zod"

export interface ViseRiserShape {
  length: number
  width: number
  height: number
  wallThickness: number
  coreLength: number
  coreWidth: number
  coreHeight: number
  topSeatWidth: number
  topSeatDepth: number
  mounts: number
  holeDiameter: number
  pitchX: number
  pitchY: number
}

export function validateViseRiserProps(
  p: ViseRiserShape,
  ctx: z.RefinementCtx,
): void {
  if (
    p.coreLength > p.length - 2 * p.wallThickness ||
    p.coreWidth > p.width - 2 * p.wallThickness
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["coreWidth"],
      message: "Internal core cavity violates minimum side wall thickness",
    })
  }
  if (p.coreHeight + p.topSeatDepth >= p.height - 6) {
    ctx.addIssue({
      code: "custom",
      path: ["coreHeight"],
      message:
        "Core cavity and top seat rebate leave insufficient top deck thickness",
    })
  }
  if (
    p.pitchX + p.holeDiameter > p.length - 4 ||
    p.pitchY + p.holeDiameter > p.width - 4
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["pitchX"],
      message: "Table mounting holes break through riser footprint",
    })
  }
}
