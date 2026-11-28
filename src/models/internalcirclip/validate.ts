import type { z } from "zod"
import { findDin472InternalCirclipSpec } from "./table"

export interface InternalCirclipShape {
  din472: true
  boreDiameter: number
  free: true
}

export function validateInternalCirclipProps(
  p: InternalCirclipShape,
  ctx: z.RefinementCtx,
): void {
  const spec = findDin472InternalCirclipSpec(p.boreDiameter)
  if (!spec) {
    ctx.addIssue({
      code: "custom",
      path: ["boreDiameter"],
      message: `Unsupported DIN 472 bore diameter ${p.boreDiameter} mm`,
    })
  }
}
