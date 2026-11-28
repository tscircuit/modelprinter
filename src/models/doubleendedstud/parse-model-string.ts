import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { doubleEndedStudModelDefinitionSchema } from "./schema"

const lengths = {
  l: "length",
  length: "length",
  threadl: "threadLength",
  chamfer: "chamfer",
} as const

export function parseDoubleEndedStudModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "doubleendedstud" ||
    tokens[0]?.toLowerCase() !== "doubleendedstud"
  ) {
    throw new Error("Expected doubleendedstud without an inline value")
  }
  const props: Record<string, unknown> = { fn: "doubleendedstud" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for doubleendedstud`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "custom") {
      property = "custom"
      parsed = true
    } else if (lower === "equalends") {
      property = "equalEnds"
      parsed = true
    } else if (lower === "smoothmiddle") {
      property = "smoothMiddle"
      parsed = true
    } else if (lower === "chamfertip") {
      property = "chamferTip"
      parsed = true
    } else if (/^m(?:\d+(?:\.\d+)?)$/i.test(lower)) {
      property = "thread"
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
        throw new Error(`Unknown doubleendedstud token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate doubleendedstud property "${property}"`)
    }
    props[property] = parsed
  }
  return doubleEndedStudModelDefinitionSchema.parse(props)
}
