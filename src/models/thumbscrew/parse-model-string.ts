import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { thumbScrewModelDefinitionSchema } from "./schema"

const lengths = {
  l: "length",
  length: "length",
  headod: "headOuterDiameter",
  headh: "headHeight",
  knurlp: "knurlPitch",
} as const

export function parseThumbScrewModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "thumbscrew" || tokens[0]?.toLowerCase() !== "thumbscrew") {
    throw new Error("Expected thumbscrew without an inline value")
  }
  const props: Record<string, unknown> = { fn: "thumbscrew" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for thumbscrew`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "custom") {
      property = "custom"
      parsed = true
    } else if (lower === "straightknurl") {
      property = "straightKnurl"
      parsed = true
    } else if (lower === "fullthread") {
      property = "fullThread"
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
        throw new Error(`Unknown thumbscrew token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate thumbscrew property "${property}"`)
    }
    props[property] = parsed
  }
  return thumbScrewModelDefinitionSchema.parse(props)
}
