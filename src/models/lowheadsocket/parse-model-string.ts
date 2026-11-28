import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { lowHeadSocketModelDefinitionSchema } from "./schema"

const lengths = {
  l: "length",
  length: "length",
} as const

export function parseLowHeadSocketModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "lowheadsocket" ||
    tokens[0]?.toLowerCase() !== "lowheadsocket"
  ) {
    throw new Error("Expected lowheadsocket without an inline argument")
  }
  const props: Record<string, unknown> = { fn: "lowheadsocket" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for lowheadsocket`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "din7984") {
      property = "din7984"
      parsed = true
    } else if (lower === "hexsocket") {
      property = "hexSocket"
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
        throw new Error(`Unknown lowheadsocket token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate lowheadsocket property "${property}"`)
    }
    props[property] = parsed
  }
  return lowHeadSocketModelDefinitionSchema.parse(props)
}
