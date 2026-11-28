import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { roundBeltPulleyModelDefinitionSchema } from "./schema"

const lengths = {
  od: "outerDiameter",
  bore: "boreDiameter",
  w: "width",
  width: "width",
  groover: "grooveRadius",
} as const

export function parseRoundBeltPulleyModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "roundbeltpulley" ||
    tokens[0]?.toLowerCase() !== "roundbeltpulley"
  ) {
    throw new Error("Expected roundbeltpulley without an inline value")
  }
  const props: Record<string, unknown> = { fn: "roundbeltpulley" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for roundbeltpulley`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "semicirculargroove") {
      property = "semicircularGroove"
      parsed = true
    } else if (lower === "setscrew") {
      property = "setScrew"
      parsed = true
    } else if (/^m(?:\d+(?:\.\d+)?)$/i.test(lower)) {
      property = "setScrewThread"
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
        throw new Error(`Unknown roundbeltpulley token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate roundbeltpulley property "${property}"`)
    }
    props[property] = parsed
  }
  return roundBeltPulleyModelDefinitionSchema.parse(props)
}
