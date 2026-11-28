import type { z } from "zod"

export interface IBeamShape {
  height: number
  width: number
  webThickness: number
  flangeThickness: number
  rootRadius: number
  length: number
  ipe80: true
  en10365: true
}

export function validateIBeamProps(p: IBeamShape, ctx: z.RefinementCtx): void {
  if (2 * p.flangeThickness + 2 * p.rootRadius >= p.height - 4) {
    ctx.addIssue({
      code: "custom",
      path: ["flangeThickness"],
      message: "Flange thickness and root fillets leave no straight web depth",
    })
  }
  if (p.webThickness + 2 * p.rootRadius >= p.width - 4) {
    ctx.addIssue({
      code: "custom",
      path: ["webThickness"],
      message: "Web thickness and root fillets exceed flange width",
    })
  }
}
