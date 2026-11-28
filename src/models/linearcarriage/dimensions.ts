import {
  type LinearCarriageModelPropsInput,
  linearCarriageModelPropsSchema,
} from "./schema"

export function getLinearCarriageDimensions(
  input: LinearCarriageModelPropsInput = {},
) {
  const p = linearCarriageModelPropsSchema.parse(input)
  const railClearanceHeight = 4.6
  const carriageBodyHeight = p.assemblyHeight - railClearanceHeight
  return {
    ...p,
    railWidth: 15,
    railClearanceHeight,
    carriageBodyHeight,
    mountingHoleCount: 4,
    bottomZ: railClearanceHeight,
    topZ: p.assemblyHeight,
  }
}
