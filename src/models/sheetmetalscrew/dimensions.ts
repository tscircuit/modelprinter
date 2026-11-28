import {
  type SheetMetalScrewModelPropsInput,
  sheetMetalScrewModelPropsSchema,
} from "./schema"
import { findIso7049Spec } from "./table"

export function getSheetMetalScrewDimensions(
  input: SheetMetalScrewModelPropsInput,
) {
  const p = sheetMetalScrewModelPropsSchema.parse(input)
  const spec = findIso7049Spec(p.tappingSize)
  if (!spec) {
    throw new Error(`Missing ISO 7049 spec for "${p.tappingSize}"`)
  }
  return {
    ...p,
    majorDiameter: spec.majorDiameter,
    headDiameter: spec.headDiameter,
    headHeight: spec.headHeight,
    overallLength: p.length + spec.headHeight,
    bottomZ: -p.length,
    topZ: spec.headHeight,
  }
}
