import type { z } from "zod"

export interface BrakedCasterShape {
  wheelDiameter: number
  wheelWidth: number
  plateWidth: number
  plateLength: number
  plate4Hole: true
  holeGridX: number
  holeGridY: number
  holeDiameter: number
  totalBrake: true
}

export function validateBrakedCasterProps(
  p: BrakedCasterShape,
  ctx: z.RefinementCtx,
): void {
  if (p.wheelWidth >= p.plateWidth) {
    ctx.addIssue({
      code: "custom",
      path: ["wheelWidth"],
      message: "Wheel width must fit inside the top mounting plate width",
    })
  }
  if (
    p.holeGridX + p.holeDiameter >= p.plateWidth ||
    p.holeGridY + p.holeDiameter >= p.plateLength
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["holeGridX"],
      message: "Top-plate mounting hole grid must stay inside the plate edges",
    })
  }
}
