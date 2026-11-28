import type { z } from "zod"

export interface BladeFuseShape {
  regularFlatBlade: true
  width: number
  bodyHeight: number
  thickness: number
  blades: 2
  bladeLength: number
  bladeWidth: number
  bladeThickness: number
  pitch: number
}

export function validateBladeFuseProps(
  p: BladeFuseShape,
  ctx: z.RefinementCtx,
): void {
  if (p.bladeWidth >= p.pitch) {
    ctx.addIssue({
      code: "custom",
      path: ["bladeWidth"],
      message: "Blade width must be less than center-to-center blade pitch",
    })
  }
  if (p.pitch + p.bladeWidth > p.width) {
    ctx.addIssue({
      code: "custom",
      path: ["pitch"],
      message: "Outer span across parallel blades exceeds fuse body width",
    })
  }
  if (p.bladeThickness >= p.thickness) {
    ctx.addIssue({
      code: "custom",
      path: ["bladeThickness"],
      message: "Blade thickness must fit inside insulating housing thickness",
    })
  }
}
