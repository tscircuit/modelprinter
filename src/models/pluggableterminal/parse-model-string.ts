import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { pluggableTerminalModelDefinitionSchema } from "./schema"

const lengths = {
  p: "pitch",
  pitch: "pitch",
  w: "width",
  width: "width",
  h: "height",
  height: "height",
  d: "depth",
  depth: "depth",
} as const

export function parsePluggableTerminalModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "pluggableterminal" ||
    tokens[0]?.toLowerCase() !== "pluggableterminal"
  ) {
    throw new Error("Expected pluggableterminal without an inline value")
  }
  const props: Record<string, unknown> = { fn: "pluggableterminal" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for pluggableterminal`,
      )
    }
    const lower = token.toLowerCase()
    const screwMatch = lower.match(/^screw(m\d+(?:\.\d+)?)$/)
    let property: string
    let parsed: unknown
    if (lower === "frontwire") {
      property = "frontWire"
      parsed = true
    } else if (lower === "bottomfemale") {
      property = "bottomFemale"
      parsed = true
    } else if (screwMatch) {
      property = "screwThread"
      parsed = screwMatch[1]
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName === "n" || tokenName === "poles") {
        property = "poles"
        parsed = parseGearInteger(tokenArg, tokenName)
      } else if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown pluggableterminal token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate pluggableterminal property "${property}"`)
    }
    props[property] = parsed
  }
  return pluggableTerminalModelDefinitionSchema.parse(props)
}
