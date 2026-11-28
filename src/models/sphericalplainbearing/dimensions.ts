import {
  type SphericalPlainBearingModelPropsInput,
  sphericalPlainBearingModelPropsSchema,
} from "./schema"

export function getSphericalPlainBearingDimensions(
  input: SphericalPlainBearingModelPropsInput = {},
) {
  const p = sphericalPlainBearingModelPropsSchema.parse(input)
  return {
    ...p,
    sphereDiameter: (p.innerDiameter + p.outerDiameter) / 2,
    frontY: -p.width / 2,
    backY: p.width / 2,
  }
}
