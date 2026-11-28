import {
  type EnclosureLidModelPropsInput,
  enclosureLidModelPropsSchema,
} from "./schema"

export function getEnclosureLidDimensions(
  input: EnclosureLidModelPropsInput = {},
) {
  const p = enclosureLidModelPropsSchema.parse(input)
  const overallHeight = p.thickness + p.rimDepth
  return {
    ...p,
    overallHeight,
    bottomZ: -p.rimDepth,
    topZ: p.thickness,
  }
}
