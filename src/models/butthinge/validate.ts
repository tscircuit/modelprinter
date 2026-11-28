import type { z } from "zod"

export interface ButtHingeShape {
  openWidth: number
  length: number
  leafThickness: number
  pinDiameter: number
  knuckles: number
  holes: 4 | 6 | 8
  holeDiameter: number
  holePitchX: number
  holePitchY: number
  equalLeaf: true
  openAngle: 180
}

export function validateButtHingeProps(
  p: ButtHingeShape,
  ctx: z.RefinementCtx,
): void {
  if (p.knuckles % 2 === 0) {
    ctx.addIssue({
      code: "custom",
      path: ["knuckles"],
      message: "Alternating symmetric butt hinge requires an odd knuckle count",
    })
  }
  const barrelDiameter = p.pinDiameter + 2 * p.leafThickness
  if (
    p.holePitchX <= barrelDiameter + p.holeDiameter ||
    p.holePitchX + p.holeDiameter >= p.openWidth
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["holePitchX"],
      message:
        "Leaf screw X pitch must clear the central knuckle barrel and outer leaf edges",
    })
  }
  const holesPerLeaf = p.holes / 2
  if ((holesPerLeaf - 1) * p.holePitchY + p.holeDiameter >= p.length) {
    ctx.addIssue({
      code: "custom",
      path: ["holePitchY"],
      message: "Longitudinal screw hole span must fit inside leaf length",
    })
  }
}
