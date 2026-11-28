import {
  type CylindricalRollerBearingModelPropsInput,
  cylindricalRollerBearingModelPropsSchema,
} from "./schema"

export function getCylindricalRollerBearingDimensions(
  input: CylindricalRollerBearingModelPropsInput = {},
) {
  const p = cylindricalRollerBearingModelPropsSchema.parse(input)
  return {
    ...p,
    pitchCircleDiameter: (p.innerDiameter + p.outerDiameter) / 2,
    radialSection: (p.outerDiameter - p.innerDiameter) / 2,
    frontY: -p.width / 2,
    backY: p.width / 2,
  }
}
