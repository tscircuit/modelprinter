import type { z } from "zod"

export interface SilencerShape {
  portNominal: number
  outerDiameter: number
  length: number
  hexAcrossFlats: number
  porousCylinder: boolean
  closedTip: boolean
}

export function validateSilencerProps(
  p: SilencerShape,
  ctx: z.RefinementCtx,
): void {
  if (p.hexAcrossFlats <= p.portNominal + 1.5) {
    ctx.addIssue({
      code: "custom",
      path: ["hexAcrossFlats"],
      message: "Wrench hex across-flats must exceed male thread nominal size",
    })
  }
  if (p.outerDiameter <= p.portNominal + 2) {
    ctx.addIssue({
      code: "custom",
      path: ["outerDiameter"],
      message: "Porous silencer body diameter must exceed inlet thread size",
    })
  }
}
