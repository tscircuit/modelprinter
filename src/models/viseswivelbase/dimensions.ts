import {
  type ViseSwivelBaseModelPropsInput,
  viseSwivelBaseModelPropsSchema,
} from "./schema"

export function getViseSwivelBaseDimensions(
  input: ViseSwivelBaseModelPropsInput = {},
) {
  const p = viseSwivelBaseModelPropsSchema.parse(input)
  return {
    ...p,
    flangeRadialStep: (p.outerDiameter - p.topOuterDiameter) / 2,
    bottomZ: 0,
    topZ: p.height,
  }
}
