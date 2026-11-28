import {
  type GrooveRollerBearingModelPropsInput,
  grooveRollerBearingModelPropsSchema,
} from "./schema"

export function getGrooveRollerBearingDimensions(
  input: GrooveRollerBearingModelPropsInput = {},
) {
  const p = grooveRollerBearingModelPropsSchema.parse(input)
  return {
    ...p,
    rootDiameter: p.outerDiameter - 2 * p.grooveDepth,
    frontY: -p.width / 2,
    backY: p.width / 2,
  }
}
