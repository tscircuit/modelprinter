import {
  type NeedleRollerBearingModelPropsInput,
  needleRollerBearingModelPropsSchema,
} from "./schema"

export function getNeedleRollerBearingDimensions(
  input: NeedleRollerBearingModelPropsInput = {},
) {
  const p = needleRollerBearingModelPropsSchema.parse(input)
  return {
    ...p,
    radialSection: (p.outerDiameter - p.innerDiameter) / 2,
    frontY: -p.width / 2,
    backY: p.width / 2,
  }
}
