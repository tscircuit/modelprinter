import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { leadScrewModelDefinitionSchema } from "./schema"

const lengths = {
  d: "diameter",
  diameter: "diameter",
  l: "length",
  length: "length",
  threadpitch: "threadPitch",
  lead: "lead",
} as const

export function parseLeadScrewModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "leadscrew" || tokens[0]?.toLowerCase() !== "leadscrew") {
    throw new Error("Expected leadscrew without an inline value")
  }
  const props: Record<string, unknown> = { fn: "leadscrew" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for leadscrew`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "righthanded") {
      property = "rightHanded"
      parsed = true
    } else if (/^tr(?:\d+(?:\.\d+)?)$/i.test(lower)) {
      property = "trapezoidalThread"
      parsed = lower
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName === "starts") {
        property = "starts"
        parsed = parseGearInteger(tokenArg, "starts")
      } else if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown leadscrew token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate leadscrew property "${property}"`)
    }
    props[property] = parsed
  }
  return leadScrewModelDefinitionSchema.parse(props)
}
