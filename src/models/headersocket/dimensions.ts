import {
  type HeaderSocketModelPropsInput,
  headerSocketModelPropsSchema,
} from "./schema"

export function getHeaderSocketDimensions(
  input: HeaderSocketModelPropsInput = {},
) {
  const p = headerSocketModelPropsSchema.parse(input)
  return {
    ...p,
    columns: p.contacts / p.rows,
    tailTipZ: -p.tailLength,
    boardZ: 0,
    topZ: p.height,
  }
}
