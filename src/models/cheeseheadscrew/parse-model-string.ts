import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { cheeseHeadScrewModelDefinitionSchema } from "./schema"

const lengths = {
  l: "length",
  length: "length",
} as const

export function parseCheeseHeadScrewModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "cheeseheadscrew" ||
    tokens[0]?.toLowerCase() !== "cheeseheadscrew"
  ) {
    throw new Error("Expected cheeseheadscrew without an inline argument")
  }
  const props: Record<string, unknown> = { fn: "cheeseheadscrew" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for cheeseheadscrew`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "iso1207") {
      property = "iso1207"
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
        throw new Error(`Unknown cheeseheadscrew token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate cheeseheadscrew property "${property}"`)
    }
    props[property] = parsed
  }
  return cheeseHeadScrewModelDefinitionSchema.parse(props)
}
