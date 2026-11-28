import {
  type JawCouplerSpiderModelPropsInput,
  jawCouplerSpiderModelPropsSchema,
} from "./schema"

export function getJawCouplerSpiderDimensions(
  input: JawCouplerSpiderModelPropsInput = {},
) {
  const p = jawCouplerSpiderModelPropsSchema.parse(input)
  return {
    ...p,
    lobeRadialSpan: (p.outerDiameter - p.innerDiameter) / 2,
    frontY: -p.width / 2,
    backY: p.width / 2,
  }
}
