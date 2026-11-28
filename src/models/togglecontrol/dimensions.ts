import {
  type ToggleControlModelPropsInput,
  toggleControlModelPropsSchema,
} from "./schema"

export function getToggleControlDimensions(
  input: ToggleControlModelPropsInput = {},
) {
  const p = toggleControlModelPropsSchema.parse(input)
  const bushingNominalDiameter = Number(p.thread.slice(1))
  const solderLugLength = 4
  const overallHeight =
    solderLugLength + p.bodyHeight + p.bushingLength + p.leverLength
  return {
    ...p,
    bushingNominalDiameter,
    solderLugLength,
    overallHeight,
    lugTipZ: -(p.bodyHeight + solderLugLength),
    panelSeatZ: 0,
    bushingTopZ: p.bushingLength,
    leverTipZ: p.bushingLength + p.leverLength,
  }
}
