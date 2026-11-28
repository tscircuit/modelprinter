import type { z } from "zod"

export interface FuseBlockShape {
  fuseDiameter: number
  fuseLength: number
  width: number
  length: number
  height: number
  clipOuterDiameter: number
  holes: 2
  holeDiameter: number
  holePitch: number
}

export function validateFuseBlockProps(
  p: FuseBlockShape,
  ctx: z.RefinementCtx,
): void {
  if (p.fuseLength >= p.length - 4) {
    ctx.addIssue({
      code: "custom",
      path: ["fuseLength"],
      message: "Cartridge fuse length exceeds insulating cradle length",
    })
  }
  if (Math.max(p.fuseDiameter, p.clipOuterDiameter) >= p.width - 2) {
    ctx.addIssue({
      code: "custom",
      path: ["width"],
      message: "Fuse clip diameter exceeds insulating block width",
    })
  }
  if (p.holePitch + p.holeDiameter >= p.length) {
    ctx.addIssue({
      code: "custom",
      path: ["holePitch"],
      message: "Base fixing hole pitch exceeds block length",
    })
  }
}
