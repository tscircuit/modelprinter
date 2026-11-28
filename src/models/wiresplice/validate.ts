import type { z } from "zod"

export interface WireSpliceShape {
  width: number
  height: number
  depth: number
  ports: number
  portInnerDiameter: number
  portPitch: number
  levers: number
  snapBracket: true
}

export function validateWireSpliceProps(
  p: WireSpliceShape,
  ctx: z.RefinementCtx,
): void {
  if (p.ports !== p.levers) {
    ctx.addIssue({
      code: "custom",
      path: ["levers"],
      message: "Actuating lever count must match conductor port count",
    })
  }
  if (
    p.portInnerDiameter >= p.portPitch - 0.8 ||
    (p.ports - 1) * p.portPitch + p.portInnerDiameter >= p.width - 2
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["portPitch"],
      message: "Conductor entry ports overflow splice block width",
    })
  }
}
