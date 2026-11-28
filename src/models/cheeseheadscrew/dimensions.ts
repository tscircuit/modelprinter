import {
  type CheeseHeadScrewModelPropsInput,
  cheeseHeadScrewModelPropsSchema,
} from "./schema"
import { findIso1207Spec } from "./table"

export function getCheeseHeadScrewDimensions(
  input: CheeseHeadScrewModelPropsInput,
) {
  const p = cheeseHeadScrewModelPropsSchema.parse(input)
  const spec = findIso1207Spec(p.thread)
  if (!spec) {
    throw new Error(`Missing ISO 1207 spec for "${p.thread}"`)
  }
  return {
    ...p,
    majorDiameter: spec.majorDiameter,
    threadPitch: spec.threadPitch,
    headDiameter: spec.headDiameter,
    headHeight: spec.headHeight,
    slotWidth: spec.slotWidth,
    slotDepth: spec.slotDepth,
    overallLength: p.length + spec.headHeight,
    bottomZ: -p.length,
    topZ: spec.headHeight,
  }
}
