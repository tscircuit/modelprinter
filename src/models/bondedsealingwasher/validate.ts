import type { z } from "zod"

export interface BondedSealingWasherShape {
  innerDiameter: number
  metalInnerDiameter: number
  outerDiameter: number
  metalHeight: number
  sealOuterDiameter: number
  sealHeight: number
  doubleLip: true
}

export function validateBondedSealingWasherProps(
  p: BondedSealingWasherShape,
  ctx: z.RefinementCtx,
): void {
  if (
    p.innerDiameter >= p.metalInnerDiameter - 0.8 ||
    p.metalInnerDiameter >= p.sealOuterDiameter ||
    p.sealOuterDiameter >= p.outerDiameter - 2
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["sealOuterDiameter"],
      message:
        "Bonded Dowty washer requires ordered inner lip, metal bore, seal bond, and outer ring diameters",
    })
  }
  if (p.metalHeight >= p.sealHeight) {
    ctx.addIssue({
      code: "custom",
      path: ["sealHeight"],
      message: "Elastomer sealing lip height must protrude proud of metal ring",
    })
  }
}
