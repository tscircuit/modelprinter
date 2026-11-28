import {
  type InductiveSensorModelPropsInput,
  inductiveSensorModelPropsSchema,
} from "./schema"

export function getInductiveSensorDimensions(
  input: InductiveSensorModelPropsInput = {},
) {
  const p = inductiveSensorModelPropsSchema.parse(input)
  return {
    ...p,
    overallEnvelopeLength: p.length + p.cableLength,
  }
}
