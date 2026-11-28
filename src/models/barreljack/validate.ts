import type { z } from "zod"

export interface BarrelJackShape {
  boxJack: true
  plugOuterDiameter: number
  centerPinDiameter: number
  width: number
  height: number
  length: number
  throughHole: true
  horizontal: true
  contacts: 3
  frontCenterRear: true
}

export function validateBarrelJackProps(
  p: BarrelJackShape,
  ctx: z.RefinementCtx,
): void {
  if (p.plugOuterDiameter - p.centerPinDiameter < 1) {
    ctx.addIssue({
      code: "custom",
      path: ["centerPinDiameter"],
      message:
        "Plug outer diameter must exceed center pin diameter with at least 1 mm diametral clearance",
    })
  }
  if (p.plugOuterDiameter >= Math.min(p.width, p.height)) {
    ctx.addIssue({
      code: "custom",
      path: ["plugOuterDiameter"],
      message:
        "Mating plug outer diameter must fit inside the box housing width and height",
    })
  }
  if (p.length <= p.plugOuterDiameter) {
    ctx.addIssue({
      code: "custom",
      path: ["length"],
      message: "Housing length must exceed the mating plug diameter",
    })
  }
}
