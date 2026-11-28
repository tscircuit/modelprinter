import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { parseSpeedNutMetricThread } from "./normalize"
import { speedNutModelDefinitionSchema } from "./schema"

const lengths = {
  w: "width",
  l: "length",
  h: "stripThickness",
  tabh: "tabHeight",
  tabw: "tabWidth",
} as const

export function parseSpeedNutModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "speednut" || tokens[0]?.toLowerCase() !== "speednut") {
    throw new Error("Expected speednut without an inline value")
  }
  const props: Record<string, unknown> = { fn: "speednut" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for speednut`,
      )
    }
    const lower = token.toLowerCase()
    if (lower === "vbend") {
      if (Object.hasOwn(props, "vBend")) {
        throw new Error("Duplicate speednut vbend flag")
      }
      props.vBend = true
      continue
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName === "m") {
      if (!tokenArg) throw new Error(`Missing metric size in "${token}"`)
      if (Object.hasOwn(props, "threadDiameter")) {
        throw new Error("Duplicate speednut thread size")
      }
      props.threadDiameter = parseSpeedNutMetricThread(tokenArg)
    } else if (tokenName === "tabs") {
      if (!tokenArg) throw new Error(`Missing tab count in "${token}"`)
      if (Object.hasOwn(props, "tabs")) {
        throw new Error("Duplicate speednut tabs")
      }
      props.tabs = parseGearInteger(tokenArg, "tabs")
    } else if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate speednut property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown speednut token "${token}"`)
    }
  }
  return speedNutModelDefinitionSchema.parse(props)
}
