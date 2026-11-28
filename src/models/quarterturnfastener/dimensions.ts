import {
  type QuarterTurnFastenerModelPropsInput,
  quarterTurnFastenerModelPropsSchema,
} from "./schema"

export function getQuarterTurnFastenerDimensions(
  input: QuarterTurnFastenerModelPropsInput = {},
) {
  const p = quarterTurnFastenerModelPropsSchema.parse(input)
  return {
    ...p,
    pinWingProjection: (p.crossPinLength - p.shankDiameter) / 2,
    tipZ: -p.length,
    headTopZ: p.headHeight,
  }
}
