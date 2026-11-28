import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { circuitBreakerModelDefinitionSchema } from "./schema"

const lengths = {
  w: "width",
  width: "width",
  h: "height",
  height: "height",
  d: "depth",
  depth: "depth",
} as const

export function parseCircuitBreakerModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "circuitbreaker" ||
    tokens[0]?.toLowerCase() !== "circuitbreaker"
  ) {
    throw new Error("Expected circuitbreaker without an inline value")
  }
  const props: Record<string, unknown> = { fn: "circuitbreaker" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for circuitbreaker`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "th35x7.5" || lower === "railth35x7.5") {
      property = "th35x75Rail"
      parsed = true
    } else if (lower === "fronttoggle") {
      property = "frontToggle"
      parsed = true
    } else if (lower === "topbottomterminals" || lower === "topbottom") {
      property = "topBottomTerminals"
      parsed = true
    } else if (lower === "stepped") {
      property = "stepped"
      parsed = true
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else if (tokenName === "poles") {
        if (
          tokenArg !== "1" &&
          tokenArg !== "2" &&
          tokenArg !== "3" &&
          tokenArg !== "4"
        ) {
          throw new Error(`Unsupported pole count token "${token}"`)
        }
        property = "poles"
        parsed = Number(tokenArg)
      } else {
        throw new Error(`Unknown circuitbreaker token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate circuitbreaker property "${property}"`)
    }
    props[property] = parsed
  }
  return circuitBreakerModelDefinitionSchema.parse(props)
}
