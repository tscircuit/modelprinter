import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { roundBeltModelDefinitionSchema } from "./schema"

const lengths = {
  d: "crossSectionDiameter",
  l: "pitchLength",
  length: "pitchLength",
} as const

export function parseRoundBeltModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "roundbelt" || tokens[0]?.toLowerCase() !== "roundbelt") {
    throw new Error("Expected roundbelt without an inline value")
  }
  const props: Record<string, unknown> = { fn: "roundbelt" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for roundbelt`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "endless") {
      property = "endless"
      parsed = true
    } else if (lower === "circular") {
      property = "circular"
      parsed = true
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown roundbelt token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate roundbelt property "${property}"`)
    }
    props[property] = parsed
  }
  return roundBeltModelDefinitionSchema.parse(props)
}
