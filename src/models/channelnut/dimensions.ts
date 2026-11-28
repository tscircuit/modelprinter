import {
  type ChannelNutModelPropsInput,
  channelNutModelPropsSchema,
} from "./schema"

export function getChannelNutDimensions(input: ChannelNutModelPropsInput = {}) {
  const p = channelNutModelPropsSchema.parse(input)
  return {
    ...p,
    overallFreeHeight: p.height + p.springLength,
    springBottomZ: -p.springLength,
    topZ: p.height,
  }
}
