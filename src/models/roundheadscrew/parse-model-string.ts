import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { roundHeadScrewModelDefinitionSchema } from "./schema"

const lengths = {
  l: "length",
  length: "length",
  headod: "headOuterDiameter",
  headh: "headHeight",
  slotw: "slotWidth",
  slotdepth: "slotDepth",
} as const

export function parseRoundHeadScrewModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "roundheadscrew" ||
    tokens[0]?.toLowerCase() !== "roundheadscrew"
  ) {
    throw new Error("Expected roundheadscrew without an inline value")
  }
  const props: Record<string, unknown> = { fn: "roundheadscrew" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for roundheadscrew`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "custom") {
      property = "custom"
      parsed = true
    } else if (lower === "fullthread") {
      property = "fullThread"
      parsed = true
    } else if (lower === "hemisphere") {
      property = "hemisphere"
      parsed = true
    } else if (lower === "slotted") {
      property = "slotted"
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
        throw new Error(`Unknown roundheadscrew token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate roundheadscrew property "${property}"`)
    }
    props[property] = parsed
  }
  return roundHeadScrewModelDefinitionSchema.parse(props)
}
