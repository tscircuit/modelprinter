import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { ballScrewModelDefinitionSchema } from "./schema"

const lengths = {
  d: "diameter",
  od: "diameter",
  l: "length",
  length: "length",
  pitch: "pitch",
  p: "pitch",
  endjournald: "endJournalDiameter",
  endjournall: "endJournalLength",
} as const

export function parseBallScrewModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "ballscrew" || tokens[0]?.toLowerCase() !== "ballscrew") {
    throw new Error("Expected ballscrew without an inline value")
  }
  const props: Record<string, unknown> = { fn: "ballscrew" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for ballscrew`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "gothicarch") {
      property = "gothicArch"
      parsed = true
    } else if (lower === "righthand" || lower === "righthanded") {
      property = "handedness"
      parsed = "right"
    } else if (lower === "lefthand" || lower === "lefthanded") {
      property = "handedness"
      parsed = "left"
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
        throw new Error(`Unknown ballscrew token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate ballscrew property "${property}"`)
    }
    props[property] = parsed
  }
  return ballScrewModelDefinitionSchema.parse(props)
}
