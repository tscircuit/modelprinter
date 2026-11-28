import {
  type WorkStopModelPropsInput,
  workStopModelPropsSchema,
} from "./schema"

export function getWorkStopDimensions(input: WorkStopModelPropsInput = {}) {
  const p = workStopModelPropsSchema.parse(input)
  return {
    ...p,
    maxReach: p.armLength + p.tipLength,
  }
}
