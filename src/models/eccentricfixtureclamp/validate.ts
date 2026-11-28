import type { z } from "zod"

export interface EccentricFixtureClampShape {
  outerDiameter: number
  height: number
  boreDiameter: number
  offset: number
  toothDepth: number
  toothPitch: number
  topHexAcrossFlats: number
}

export function validateEccentricFixtureClampProps(
  p: EccentricFixtureClampShape,
  ctx: z.RefinementCtx,
): void {
  const boreMaxRadius = Math.max(p.boreDiameter, p.topHexAcrossFlats) / 2
  if (p.offset + boreMaxRadius >= p.outerDiameter / 2 - p.toothDepth - 2) {
    ctx.addIssue({
      code: "custom",
      path: ["offset"],
      message: "Eccentric bore offset breaks through serrated outer rim",
    })
  }
  if (p.toothDepth >= p.toothPitch) {
    ctx.addIssue({
      code: "custom",
      path: ["toothDepth"],
      message: "Serration tooth depth must be smaller than serration pitch",
    })
  }
}
