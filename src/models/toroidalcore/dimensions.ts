import {
  type ToroidalCoreModelPropsInput,
  toroidalCoreModelPropsSchema,
} from "./schema"

export function getToroidalCoreDimensions(
  input: ToroidalCoreModelPropsInput = {},
) {
  const p = toroidalCoreModelPropsSchema.parse(input)
  const radialCrossSectionWidth = (p.outerDiameter - p.innerDiameter) / 2
  return {
    ...p,
    radialCrossSectionWidth,
    bottomZ: 0,
    topZ: p.height,
  }
}
