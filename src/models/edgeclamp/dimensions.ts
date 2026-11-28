import {
  type EdgeClampModelPropsInput,
  edgeClampModelPropsSchema,
} from "./schema"

export function getEdgeClampDimensions(input: EdgeClampModelPropsInput = {}) {
  const p = edgeClampModelPropsSchema.parse(input)
  return {
    ...p,
    extendedLength: p.length + p.jawTravel,
  }
}
