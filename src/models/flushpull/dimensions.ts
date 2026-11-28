import {
  type FlushPullModelPropsInput,
  flushPullModelPropsSchema,
} from "./schema"

export function getFlushPullDimensions(input: FlushPullModelPropsInput = {}) {
  const p = flushPullModelPropsSchema.parse(input)
  return {
    ...p,
    cutoutWidth: p.width - 2 * p.flangeWidth,
    cutoutHeight: p.height - 2 * p.flangeWidth,
    panelZ: 0,
    rearZ: -p.depth,
  }
}
