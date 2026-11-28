import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { dinRailEndStopModelDefinitionSchema } from "./schema"

const lengths = {
  w: "width",
  width: "width",
  d: "depth",
  depth: "depth",
  h: "height",
  height: "height",
  jawgap: "jawGap",
} as const

export function parseDinRailEndStopModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "dinrailendstop" ||
    tokens[0]?.toLowerCase() !== "dinrailendstop"
  ) {
    throw new Error("Expected dinrailendstop without an inline value")
  }
  const props: Record<string, unknown> = { fn: "dinrailendstop" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for dinrailendstop`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "th35x7.5") {
      property = "th35x75"
      parsed = true
    } else if (lower === "screwclamp") {
      property = "screwClamp"
      parsed = true
    } else if (/^m(?:\d+(?:\.\d+)?)$/i.test(lower)) {
      property = "clampThread"
      parsed = lower
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown dinrailendstop token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate dinrailendstop property "${property}"`)
    }
    props[property] = parsed
  }
  return dinRailEndStopModelDefinitionSchema.parse(props)
}
