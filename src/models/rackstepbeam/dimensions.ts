import {
  type RackStepBeamModelPropsInput,
  rackStepBeamModelPropsSchema,
} from "./schema"

export function getRackStepBeamDimensions(
  input: RackStepBeamModelPropsInput = {},
) {
  const p = rackStepBeamModelPropsSchema.parse(input)
  return {
    ...p,
    topChordWidth: p.width - p.stepWidth,
    lowerWebHeight: p.height - p.stepDepth,
    startX: -p.length / 2,
    endX: p.length / 2,
  }
}
