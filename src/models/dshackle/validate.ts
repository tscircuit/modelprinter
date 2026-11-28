import type { z } from "zod"

export interface DShackleShape {
  innerWidth: number
  innerHeight: number
  stockDiameter: number
  crownRadius: number
  pinDiameter: number
  eyeThickness: number
  pinThreadDiameter: number
}

export function validateDShackleProps(
  p: DShackleShape,
  ctx: z.RefinementCtx,
): void {
  if (Math.abs(2 * p.crownRadius - p.innerWidth) > 2) {
    ctx.addIssue({
      code: "custom",
      path: ["crownRadius"],
      message: "D-shackle crown diameter must match parallel leg inner spacing",
    })
  }
  if (p.crownRadius >= p.innerHeight - p.pinDiameter / 2) {
    ctx.addIssue({
      code: "custom",
      path: ["crownRadius"],
      message: "Crown radius leaves no straight parallel leg height",
    })
  }
  if (p.pinThreadDiameter > p.pinDiameter) {
    ctx.addIssue({
      code: "custom",
      path: ["pinThreadDiameter"],
      message: "Pin thread diameter cannot exceed cross pin shank diameter",
    })
  }
}
