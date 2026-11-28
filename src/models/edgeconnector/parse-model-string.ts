import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { edgeConnectorModelDefinitionSchema } from "./schema"

const lengths = {
  p: "pitch",
  pitch: "pitch",
  board: "boardThickness",
  l: "length",
  length: "length",
  h: "height",
  height: "height",
  d: "depth",
  depth: "depth",
} as const

export function parseEdgeConnectorModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "edgeconnector" ||
    tokens[0]?.toLowerCase() !== "edgeconnector"
  ) {
    throw new Error("Expected edgeconnector without an inline value")
  }
  const props: Record<string, unknown> = { fn: "edgeconnector" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for edgeconnector`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "throughhole") {
      property = "throughHole"
      parsed = true
    } else if (lower === "topslot") {
      property = "topSlot"
      parsed = true
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName === "contacts") {
        property = "contacts"
        parsed = parseGearInteger(tokenArg, "contacts")
      } else if (tokenName === "rows") {
        property = "rows"
        parsed = parseGearInteger(tokenArg, "rows")
      } else if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown edgeconnector token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate edgeconnector property "${property}"`)
    }
    props[property] = parsed
  }
  return edgeConnectorModelDefinitionSchema.parse(props)
}
