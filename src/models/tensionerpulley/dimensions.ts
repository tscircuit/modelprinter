import {
  type TensionerPulleyModelPropsInput,
  tensionerPulleyModelPropsSchema,
} from "./schema"

export function getTensionerPulleyDimensions(
  input: TensionerPulleyModelPropsInput = {},
) {
  const p = tensionerPulleyModelPropsSchema.parse(input)
  return {
    ...p,
    pivotToRimClearance:
      p.armLength - p.outerDiameter / 2 - p.pivotDiameter / 2,
    pulleyCenterX: p.armLength,
  }
}
