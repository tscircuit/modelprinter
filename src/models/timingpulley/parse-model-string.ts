import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { timingPulleyModelDefinitionSchema } from "./schema"

const lengths = {
  pitch: "pitch",
  p: "pitch",
  bore: "boreDiameter",
  id: "boreDiameter",
  w: "width",
  width: "width",
} as const

export function parseTimingPulleyModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "timingpulley" ||
    tokens[0]?.toLowerCase() !== "timingpulley"
  ) {
    throw new Error("Expected timingpulley without an inline value")
  }
  const props: Record<string, unknown> = { fn: "timingpulley" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for timingpulley`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "htd5m") {
      property = "htd5m"
      parsed = true
    } else if (lower === "setscrew") {
      property = "setScrew"
      parsed = true
    } else if (/^m(?:\d+(?:\.\d+)?)$/i.test(lower)) {
      property = "thread"
      parsed = lower
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName === "teeth") {
        property = "teeth"
        parsed = parseGearInteger(tokenArg, "teeth")
      } else if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown timingpulley token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate timingpulley property "${property}"`)
    }
    props[property] = parsed
  }
  return timingPulleyModelDefinitionSchema.parse(props)
}
