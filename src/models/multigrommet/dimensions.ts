import {
  type MultiGrommetModelPropsInput,
  multiGrommetModelPropsSchema,
} from "./schema"

export function getMultiGrommetDimensions(
  input: MultiGrommetModelPropsInput = {},
) {
  const p = multiGrommetModelPropsSchema.parse(input)
  const flangeLipHeight = (p.height - p.grooveWidth) / 2
  return {
    ...p,
    flangeLipHeight,
    bottomZ: -p.height / 2,
    topZ: p.height / 2,
  }
}
