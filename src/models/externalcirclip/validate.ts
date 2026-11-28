import type { z } from "zod"
import { findDin471ExternalCirclipSpec } from "./table"

export interface ExternalCirclipShape {
  din471: true
  shaftDiameter: number
  free: true
}

export function validateExternalCirclipProps(
  p: ExternalCirclipShape,
  ctx: z.RefinementCtx,
): void {
  const spec = findDin471ExternalCirclipSpec(p.shaftDiameter)
  if (!spec) {
    ctx.addIssue({
      code: "custom",
      path: ["shaftDiameter"],
      message: `Unsupported DIN 471 shaft diameter ${p.shaftDiameter} mm`,
    })
  }
}
