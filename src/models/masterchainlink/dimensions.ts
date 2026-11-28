import {
  type MasterChainLinkModelPropsInput,
  masterChainLinkModelPropsSchema,
} from "./schema"

export function getMasterChainLinkDimensions(
  input: MasterChainLinkModelPropsInput = {},
) {
  const p = masterChainLinkModelPropsSchema.parse(input)
  const sideStackEach = (p.width - p.innerWidth) / 2
  return {
    ...p,
    sideStackEach,
    bottomZ: -p.width / 2,
    topZ: p.width / 2,
  }
}
