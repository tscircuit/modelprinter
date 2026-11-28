import {
  type WireSpliceModelPropsInput,
  wireSpliceModelPropsSchema,
} from "./schema"

export function getWireSpliceDimensions(input: WireSpliceModelPropsInput = {}) {
  const p = wireSpliceModelPropsSchema.parse(input)
  return {
    ...p,
    portSpan: (p.ports - 1) * p.portPitch,
    baseZ: 0,
    topZ: p.height,
  }
}
