import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { relayBaseModelDefinitionSchema } from "./schema"

const lengths = {
  w: "width",
  width: "width",
  d: "depth",
  depth: "depth",
  h: "height",
  height: "height",
  socketpcd: "socketPcd",
} as const

export function parseRelayBaseModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "relaybase" || tokens[0]?.toLowerCase() !== "relaybase") {
    throw new Error("Expected relaybase without an inline value")
  }
  const props: Record<string, unknown> = { fn: "relaybase" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for relaybase`,
      )
    }
    const lower = token.toLowerCase()
    const screwMatch = lower.match(/^screw(m\d+(?:\.\d+)?)$/)
    let property: string
    let parsed: unknown
    if (lower === "th35x7.5") {
      property = "th35x75"
      parsed = true
    } else if (lower === "sidescrewterminals") {
      property = "sideScrewTerminals"
      parsed = true
    } else if (screwMatch) {
      property = "screwThread"
      parsed = screwMatch[1]
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName === "socketpins") {
        property = "socketPins"
        parsed = parseGearInteger(tokenArg, "socketPins")
      } else if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown relaybase token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate relaybase property "${property}"`)
    }
    props[property] = parsed
  }
  return relayBaseModelDefinitionSchema.parse(props)
}
