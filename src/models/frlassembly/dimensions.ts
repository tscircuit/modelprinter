import {
  type FrlAssemblyModelPropsInput,
  frlAssemblyModelPropsSchema,
} from "./schema"

export function getFrlAssemblyDimensions(
  input: FrlAssemblyModelPropsInput = {},
) {
  const p = frlAssemblyModelPropsSchema.parse(input)
  return {
    ...p,
    moduleNominalPitch: p.width / 3,
  }
}
