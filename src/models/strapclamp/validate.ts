import type { z } from "zod"

export interface StrapClampShape {
  length: number
  width: number
  thickness: number
  slotLength: number
  slotWidth: number
  noseLength: number
  noseDrop: number
  heelLength: number
  heelHeight: number
}

export function validateStrapClampProps(
  p: StrapClampShape,
  ctx: z.RefinementCtx,
): void {
  if (p.slotWidth >= p.width - 6) {
    ctx.addIssue({
      code: "custom",
      path: ["slotWidth"],
      message: "Stud slot width leaves insufficient strap side rail wall",
    })
  }
  if (p.noseLength + p.slotLength + p.heelLength >= p.length - 6) {
    ctx.addIssue({
      code: "custom",
      path: ["slotLength"],
      message: "Nose, central slot, and heel exceed overall strap length",
    })
  }
  if (p.noseDrop >= p.thickness) {
    ctx.addIssue({
      code: "custom",
      path: ["noseDrop"],
      message: "Stepped nose drop cannot exceed strap thickness",
    })
  }
}
