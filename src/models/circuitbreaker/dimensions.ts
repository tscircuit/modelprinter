import {
  type CircuitBreakerModelPropsInput,
  circuitBreakerModelPropsSchema,
} from "./schema"

export function getCircuitBreakerDimensions(
  input: CircuitBreakerModelPropsInput = {},
) {
  const p = circuitBreakerModelPropsSchema.parse(input)
  const moduleWidth = p.width / p.poles
  const railSlotWidth = 35
  const railSlotDepth = 7.5
  const noseWindowHeight = 45
  return {
    ...p,
    moduleWidth,
    railSlotWidth,
    railSlotDepth,
    noseWindowHeight,
    rearZ: 0,
    frontZ: p.depth,
    bottomY: -p.height / 2,
    topY: p.height / 2,
  }
}
