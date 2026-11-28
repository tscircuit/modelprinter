import {
  type ParallelsModelPropsInput,
  parallelsModelPropsSchema,
} from "./schema"

export function getParallelsDimensions(input: ParallelsModelPropsInput = {}) {
  const p = parallelsModelPropsSchema.parse(input)
  return {
    ...p,
    overallSpanY: p.pairGap + p.thickness,
    bedZ: 0,
    supportTopZ: p.height,
  }
}
