import { findIso7049Spec } from "./table"
import type { RawSheetMetalScrewShape } from "./validate"

export function normalizeSheetMetalScrewProps<
  T extends RawSheetMetalScrewShape,
>(p: T) {
  const spec = findIso7049Spec(p.tappingSize)
  if (!spec) {
    throw new Error(`Missing ISO 7049 spec for "${p.tappingSize}"`)
  }
  return {
    ...p,
    tappingSize: spec.tappingSize,
    threadPitch: p.threadPitch ?? spec.threadPitch,
  }
}
