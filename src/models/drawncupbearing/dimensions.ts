import {
  type DrawnCupBearingModelPropsInput,
  drawnCupBearingModelPropsSchema,
} from "./schema"

export function getDrawnCupBearingDimensions(
  input: DrawnCupBearingModelPropsInput = {},
) {
  const p = drawnCupBearingModelPropsSchema.parse(input)
  return {
    ...p,
    radialSection: (p.outerDiameter - p.innerDiameter) / 2,
    frontY: -p.width / 2,
    backY: p.width / 2,
  }
}
