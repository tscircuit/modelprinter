import {
  type DiaphragmPumpModelPropsInput,
  diaphragmPumpModelPropsSchema,
} from "./schema"

export function getDiaphragmPumpDimensions(
  input: DiaphragmPumpModelPropsInput = {},
) {
  const p = diaphragmPumpModelPropsSchema.parse(input)
  return {
    ...p,
    chamberHalfSpan: p.width / 2,
  }
}
