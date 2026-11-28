import type { z } from "zod"

export interface ControlRelayShape {
  width: number
  depth: number
  height: number
  pins: 8 | 11
  pinDiameter: number
  pinCircleDiameter: number
  centerKey: true
  rectangularCase: true
}

export function validateControlRelayProps(
  p: ControlRelayShape,
  ctx: z.RefinementCtx,
): void {
  if (p.pinCircleDiameter + p.pinDiameter >= Math.min(p.width, p.depth)) {
    ctx.addIssue({
      code: "custom",
      path: ["pinCircleDiameter"],
      message:
        "Pin circle outer span must stay inside the rectangular relay case footprint",
    })
  }
  const chordSpacing = p.pinCircleDiameter * Math.sin(Math.PI / p.pins)
  if (chordSpacing <= p.pinDiameter * 1.5) {
    ctx.addIssue({
      code: "custom",
      path: ["pinDiameter"],
      message:
        "Adjacent circular pins must maintain clearance around the pin circle",
    })
  }
}
