import {
  type StrapClampModelPropsInput,
  strapClampModelPropsSchema,
} from "./schema"

export function getStrapClampDimensions(input: StrapClampModelPropsInput = {}) {
  const p = strapClampModelPropsSchema.parse(input)
  return {
    ...p,
    noseTipThickness: p.thickness - p.noseDrop,
  }
}
