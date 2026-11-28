import {
  type VRollerBearingModelPropsInput,
  vRollerBearingModelPropsSchema,
} from "./schema"

export function getVRollerBearingDimensions(
  input: VRollerBearingModelPropsInput = {},
) {
  const p = vRollerBearingModelPropsSchema.parse(input)
  return {
    ...p,
    rootDiameter: p.outerDiameter - 2 * p.grooveDepth,
    frontY: -p.width / 2,
    backY: p.width / 2,
  }
}
