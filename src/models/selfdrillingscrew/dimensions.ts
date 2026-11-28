import {
  type SelfDrillingScrewModelPropsInput,
  selfDrillingScrewModelPropsSchema,
} from "./schema"

export function getSelfDrillingScrewDimensions(
  input: SelfDrillingScrewModelPropsInput = {},
) {
  const p = selfDrillingScrewModelPropsSchema.parse(input)
  const overallLength = p.length + p.headHeight
  const unthreadedUnderHeadRelief = Math.max(
    0,
    p.length - p.threadLength - p.drillLength,
  )
  return {
    ...p,
    overallLength,
    unthreadedUnderHeadRelief,
    bottomZ: -p.length,
    topZ: p.headHeight,
  }
}
