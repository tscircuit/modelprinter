import {
  type GroundingBusbarModelPropsInput,
  groundingBusbarModelPropsSchema,
} from "./schema"

export function getGroundingBusbarDimensions(
  input: GroundingBusbarModelPropsInput = {},
) {
  const p = groundingBusbarModelPropsSchema.parse(input)
  const screwMajorDiameter = Number(p.screwThread.slice(1))
  const conductorSpan = (p.bores - 1) * p.pitch
  return {
    ...p,
    screwMajorDiameter,
    conductorSpan,
    bottomZ: 0,
    topZ: p.width,
  }
}
