import {
  type CheckerPlateModelPropsInput,
  checkerPlateModelPropsSchema,
} from "./schema"

export function getCheckerPlateDimensions(
  input: CheckerPlateModelPropsInput = {},
) {
  const p = checkerPlateModelPropsSchema.parse(input)
  return {
    ...p,
    overallThickness: p.thickness + p.rise,
    bottomZ: 0,
    treadPeakZ: p.thickness + p.rise,
  }
}
