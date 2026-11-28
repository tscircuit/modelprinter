import {
  type TurnbuckleModelPropsInput,
  turnbuckleModelPropsSchema,
} from "./schema"

export function getTurnbuckleDimensions(input: TurnbuckleModelPropsInput = {}) {
  const p = turnbuckleModelPropsSchema.parse(input)
  return {
    ...p,
    eyeOuterDiameter: p.eyeInnerDiameter + 2 * p.eyeWireDiameter,
    bossLengthEachEnd: (p.bodyLength - p.openLength) / 2,
  }
}
