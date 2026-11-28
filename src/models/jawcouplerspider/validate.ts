import type { z } from "zod"

export interface JawCouplerSpiderShape {
  outerDiameter: number
  innerDiameter: number
  width: number
  lobes: number
  hubClearance: number
  curvedLobe: true
}

export function validateJawCouplerSpiderProps(
  p: JawCouplerSpiderShape,
  ctx: z.RefinementCtx,
): void {
  if (
    p.innerDiameter >= p.outerDiameter - 8 ||
    p.hubClearance >= p.outerDiameter - 4
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["innerDiameter"],
      message: "Spider center bore leaves insufficient radial lobe length",
    })
  }
  if (p.lobes % 2 !== 0) {
    ctx.addIssue({
      code: "custom",
      path: ["lobes"],
      message: "Jaw coupling spider lobe count must be even",
    })
  }
}
