import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { parseChannelNutMetricThread } from "./normalize"
import { channelNutModelDefinitionSchema } from "./schema"

const lengths = {
  w: "width",
  l: "length",
  h: "height",
  groovew: "grooveWidth",
  groovedepth: "grooveDepth",
  springod: "springOuterDiameter",
  springl: "springLength",
  springwire: "springWireDiameter",
} as const

export function parseChannelNutModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "channelnut" || tokens[0]?.toLowerCase() !== "channelnut") {
    throw new Error("Expected channelnut without an inline value")
  }
  const props: Record<string, unknown> = { fn: "channelnut" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for channelnut`,
      )
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName === "m") {
      if (!tokenArg) throw new Error(`Missing metric size in "${token}"`)
      if (Object.hasOwn(props, "threadDiameter")) {
        throw new Error("Duplicate channelnut thread size")
      }
      props.threadDiameter = parseChannelNutMetricThread(tokenArg)
    } else if (tokenName === "grooves") {
      if (!tokenArg) throw new Error(`Missing groove count in "${token}"`)
      if (Object.hasOwn(props, "grooves")) {
        throw new Error("Duplicate channelnut grooves")
      }
      props.grooves = parseGearInteger(tokenArg, "grooves")
    } else if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate channelnut property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown channelnut token "${token}"`)
    }
  }
  return channelNutModelDefinitionSchema.parse(props)
}
