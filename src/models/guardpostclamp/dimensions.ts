import {
  type GuardPostClampModelPropsInput,
  guardPostClampModelPropsSchema,
} from "./schema"

export function getGuardPostClampDimensions(
  input: GuardPostClampModelPropsInput = {},
) {
  const p = guardPostClampModelPropsSchema.parse(input)
  return {
    ...p,
    overallSpanWidth: p.insideWidth + 2 * p.wallThickness + 2 * p.earWidth,
    bottomZ: -p.height / 2,
    topZ: p.height / 2,
  }
}
