import {
  type TrackRollerBearingModelPropsInput,
  trackRollerBearingModelPropsSchema,
} from "./schema"

export function getTrackRollerBearingDimensions(
  input: TrackRollerBearingModelPropsInput = {},
) {
  const p = trackRollerBearingModelPropsSchema.parse(input)
  return {
    ...p,
    radialSection: (p.outerDiameter - p.boreDiameter) / 2,
    frontY: -p.width / 2,
    backY: p.width / 2,
  }
}
