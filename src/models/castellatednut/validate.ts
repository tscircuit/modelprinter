import type { z } from "zod"

export interface CastellatedNutShape {
  threadDiameter: number
  acrossFlats: number
  height: number
  castleOuterDiameter: number
  castleHeight: number
  slots: number
  slotWidth: number
  slotDepth: number
}

export function validateCastellatedNutProps(
  p: CastellatedNutShape,
  ctx: z.RefinementCtx,
): void {
  if (p.threadDiameter >= p.castleOuterDiameter - 1) {
    ctx.addIssue({
      code: "custom",
      path: ["threadDiameter"],
      message: "Thread bore exceeds castellated turret wall",
    })
  }
  if (p.castleOuterDiameter > p.acrossFlats) {
    ctx.addIssue({
      code: "custom",
      path: ["castleOuterDiameter"],
      message: "Cylindrical turret diameter exceeds hex across-flats width",
    })
  }
  if (p.castleHeight >= p.height - 2 || p.slotDepth > p.castleHeight + 0.5) {
    ctx.addIssue({
      code: "custom",
      path: ["castleHeight"],
      message: "Cotter-pin turret leaves insufficient hex wrenching base",
    })
  }
  if (p.slots % 2 !== 0) {
    ctx.addIssue({
      code: "custom",
      path: ["slots"],
      message: "Cotter-pin slot count must be even for diametral pin passage",
    })
  }
}
