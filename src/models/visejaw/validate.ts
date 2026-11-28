import type { z } from "zod"

export interface ViseJawShape {
  length: number
  height: number
  thickness: number
  holes: 2
  holeDiameter: number
  pitch: number
  holeZ: number
  stepHeight: number
  stepDepth: number
}

export function validateViseJawProps(
  p: ViseJawShape,
  ctx: z.RefinementCtx,
): void {
  if (p.stepHeight >= p.height - 4) {
    ctx.addIssue({
      code: "custom",
      path: ["stepHeight"],
      message: "Top workpiece step height consumes full jaw height",
    })
  }
  if (p.stepDepth >= p.thickness - 3) {
    ctx.addIssue({
      code: "custom",
      path: ["stepDepth"],
      message: "Top workpiece step depth consumes full jaw thickness",
    })
  }
  if (p.pitch + p.holeDiameter >= p.length) {
    ctx.addIssue({
      code: "custom",
      path: ["pitch"],
      message: "Fixing screw hole pitch exceeds jaw length",
    })
  }
  if (
    p.holeZ <= p.holeDiameter / 2 ||
    p.holeZ >= p.height - p.stepHeight - p.holeDiameter / 2
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["holeZ"],
      message: "Fixing screw hole Z encroaches on base or upper step ledge",
    })
  }
}
