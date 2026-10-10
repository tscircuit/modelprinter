import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { channelBarModelDefinitionSchema } from "./schema"
const aliases = {
  w: "width",
  h: "height",
  web: "webThickness",
  flange: "flangeThickness",
  l: "length",
  innerr: "innerRadius",
  tipr: "tipRadius",
  width: "width",
  height: "height",
  webthickness: "webThickness",
  flangethickness: "flangeThickness",
  length: "length",
  innerradius: "innerRadius",
  tipradius: "tipRadius",
} as const
export function parseChannelBarModelParams(raw: RawModelprinterParams) {
  const [name, ...tokens] = splitModelStringTokens(raw.string)
  if (raw.fn !== "channelbar" || name?.toLowerCase() !== "channelbar")
    throw new Error("Expected channelbar without inline values")
  const props: Record<string, unknown> = { fn: "channelbar" }
  for (const token of tokens) {
    const match = token.match(/^([a-z]+)(.*)$/i)
    const key = match?.[1]?.toLowerCase()
    const value = match?.[2]
    if (!key || !Object.hasOwn(aliases, key) || !value)
      throw new Error(`Unknown or malformed channelbar token "${token}"`)
    const property = aliases[key as keyof typeof aliases]
    if (Object.hasOwn(props, property))
      throw new Error(`Duplicate channelbar property "${property}"`)
    props[property] = value
  }
  return channelBarModelDefinitionSchema.parse(props)
}
