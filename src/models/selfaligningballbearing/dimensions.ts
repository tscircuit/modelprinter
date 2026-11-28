import {
  type SelfAligningBallBearingModelPropsInput,
  selfAligningBallBearingModelPropsSchema,
} from "./schema"

export function getSelfAligningBallBearingDimensions(
  input: SelfAligningBallBearingModelPropsInput = {},
) {
  const p = selfAligningBallBearingModelPropsSchema.parse(input)
  return {
    ...p,
    pitchCircleDiameter: (p.innerDiameter + p.outerDiameter) / 2,
    sphericalRaceRadius: (p.outerDiameter - 2) / 2,
    frontY: -p.width / 2,
    backY: p.width / 2,
  }
}
