import {
  type BowShackleModelPropsInput,
  bowShackleModelPropsSchema,
} from "./schema"

export function getBowShackleDimensions(input: BowShackleModelPropsInput = {}) {
  const p = bowShackleModelPropsSchema.parse(input)
  return {
    ...p,
    outerPinSpan: p.innerWidth + 2 * p.eyeThickness,
  }
}
