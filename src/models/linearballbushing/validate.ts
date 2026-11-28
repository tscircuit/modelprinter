import type { z } from "zod"

export interface LinearBallBushingShape {
  innerDiameter: number
  outerDiameter: number
  length: number
  closedRecirculating: true
  circlipGrooves: number
}

export function validateLinearBallBushingProps(
  p: LinearBallBushingShape,
  ctx: z.RefinementCtx,
): void {
  if (p.outerDiameter <= p.innerDiameter) {
    ctx.addIssue({
      code: "custom",
      path: ["outerDiameter"],
      message: "Outer diameter must exceed inner bore diameter",
    })
    return
  }
  const radialWall = (p.outerDiameter - p.innerDiameter) / 2
  if (radialWall < 1.5) {
    ctx.addIssue({
      code: "custom",
      path: ["outerDiameter"],
      message:
        "Recirculating ball bushing requires at least 1.5 mm radial wall thickness",
    })
  }
  if (p.circlipGrooves > 0 && p.length < 6) {
    ctx.addIssue({
      code: "custom",
      path: ["length"],
      message:
        "Bushing length is too short to accommodate retaining circlip grooves",
    })
  }
}
