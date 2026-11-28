import type { z } from "zod"
import { findIso7049Spec } from "./table"

export interface RawSheetMetalScrewShape {
  iso7049: true
  tappingSize: string
  threadPitch?: number
  rightHanded: boolean
  length: number
  typeC: true
  phillips: true
}

export function validateSheetMetalScrewProps(
  p: RawSheetMetalScrewShape,
  ctx: z.RefinementCtx,
): void {
  const spec = findIso7049Spec(p.tappingSize)
  if (!spec) {
    ctx.addIssue({
      code: "custom",
      path: ["tappingSize"],
      message: `Unsupported ISO 7049 tapping size "${p.tappingSize}"`,
    })
    return
  }
  if (
    p.threadPitch !== undefined &&
    Math.abs(p.threadPitch - spec.threadPitch) > 1e-6
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["threadPitch"],
      message: `Thread pitch ${p.threadPitch} mm contradicts ISO 7049 ${spec.tappingSize.toUpperCase()} (${spec.threadPitch} mm)`,
    })
  }
  if (p.length < 2 * spec.threadPitch) {
    ctx.addIssue({
      code: "custom",
      path: ["length"],
      message:
        "Under-head length is too short for a pointed type-C tapping tip",
    })
  }
}
