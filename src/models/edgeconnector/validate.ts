import type { z } from "zod"

export interface EdgeConnectorShape {
  pitch: number
  contacts: number
  rows: 2
  boardThickness: number
  length: number
  height: number
  depth: number
  throughHole: true
  topSlot: true
}

export function validateEdgeConnectorProps(
  p: EdgeConnectorShape,
  ctx: z.RefinementCtx,
): void {
  if (p.contacts % 2 !== 0) {
    ctx.addIssue({
      code: "custom",
      path: ["contacts"],
      message: "Dual-row card-edge connector requires an even contact count",
    })
    return
  }
  const span = (p.contacts / 2 - 1) * p.pitch
  if (span >= p.length - 4) {
    ctx.addIssue({
      code: "custom",
      path: ["length"],
      message: "Connector housing length cannot contain all contact positions",
    })
  }
  if (p.boardThickness >= p.depth - 2) {
    ctx.addIssue({
      code: "custom",
      path: ["boardThickness"],
      message: "Card-edge slot thickness exceeds housing wall margin",
    })
  }
}
