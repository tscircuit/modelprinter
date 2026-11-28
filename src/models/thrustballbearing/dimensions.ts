import {
  type ThrustBallBearingModelPropsInput,
  thrustBallBearingModelPropsSchema,
} from "./schema"

export function getThrustBallBearingDimensions(
  input: ThrustBallBearingModelPropsInput,
) {
  const p = thrustBallBearingModelPropsSchema.parse(input)
  const radialSectionWidth = (p.outerDiameter - p.innerDiameter) / 2
  const pitchCircleDiameter = (p.innerDiameter + p.outerDiameter) / 2
  const ballDiameter = Math.min(p.height * 0.5, radialSectionWidth * 0.7)
  const washerThickness = (p.height - ballDiameter * 0.4) / 2
  return {
    ...p,
    radialSectionWidth,
    pitchCircleDiameter,
    ballDiameter,
    washerThickness,
    bottomZ: 0,
    topZ: p.height,
  }
}
