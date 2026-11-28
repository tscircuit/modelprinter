import type { z } from "zod"

export interface RelayBaseShape {
  width: number
  depth: number
  height: number
  socketPins: 8 | 11
  socketPcd: number
  th35x75: true
  sideScrewTerminals: true
  screwThread: string
}

export function validateRelayBaseProps(
  p: RelayBaseShape,
  ctx: z.RefinementCtx,
): void {
  if (p.socketPcd >= Math.min(p.width, p.depth) - 4) {
    ctx.addIssue({
      code: "custom",
      path: ["socketPcd"],
      message: "Circular relay socket PCD exceeds base footprint margin",
    })
  }
  if (p.depth < 35) {
    ctx.addIssue({
      code: "custom",
      path: ["depth"],
      message: "Relay base depth must span a 35 mm TH35x7.5 DIN rail",
    })
  }
}
