import {
  type MagneticBaseModelPropsInput,
  magneticBaseModelPropsSchema,
} from "./schema"

export function getMagneticBaseDimensions(
  input: MagneticBaseModelPropsInput = {},
) {
  const p = magneticBaseModelPropsSchema.parse(input)
  return {
    ...p,
    verticalStandHeight: p.baseHeight + p.armLength,
  }
}
