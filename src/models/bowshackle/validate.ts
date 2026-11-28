import type { z } from "zod"

export interface BowShackleShape {
  innerWidth: number
  innerHeight: number
  stockDiameter: number
  bowRadius: number
  pinDiameter: number
  eyeThickness: number
  pinThreadDiameter: number
}

export function validateBowShackleProps(
  p: BowShackleShape,
  ctx: z.RefinementCtx,
): void {
  if (2 * p.bowRadius < p.innerWidth) {
    ctx.addIssue({
      code: "custom",
      path: ["bowRadius"],
      message:
        "Curved bow inner diameter cannot be narrower than throat inner width",
    })
  }
  if (p.bowRadius >= p.innerHeight) {
    ctx.addIssue({
      code: "custom",
      path: ["bowRadius"],
      message: "Bow radius must fit within internal rigging clearance height",
    })
  }
  if (p.pinThreadDiameter > p.pinDiameter) {
    ctx.addIssue({
      code: "custom",
      path: ["pinThreadDiameter"],
      message:
        "Pin metric thread diameter cannot exceed shackle pin shank diameter",
    })
  }
}
