import {
  type BellowsCouplerModelPropsInput,
  bellowsCouplerModelPropsSchema,
} from "./schema"

export function getBellowsCouplerDimensions(
  input: BellowsCouplerModelPropsInput = {},
) {
  const p = bellowsCouplerModelPropsSchema.parse(input)
  return {
    ...p,
    bellowsSpan: p.length * 0.45,
    startZ: 0,
    endZ: p.length,
  }
}
