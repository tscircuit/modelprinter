import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { clinchStudModelDefinitionSchema } from "./schema"

const lengths = {
  l: "length",
  length: "length",
  headod: "headOuterDiameter",
  headh: "headHeight",
  neckd: "neckDiameter",
  neckl: "neckLength",
  serrationdepth: "serrationDepth",
} as const

export function parseClinchStudModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "clinchstud" || tokens[0]?.toLowerCase() !== "clinchstud") {
    throw new Error("Expected clinchstud without an inline value")
  }
  const props: Record<string, unknown> = { fn: "clinchstud" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for clinchstud`,
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
    } else if (/^m(?:\d+(?:\.\d+)?)$/i.test(lower)) {
      property = "thread"
      parsed = lower
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName === "serrations") {
        property = "serrations"
        parsed = parseGearInteger(tokenArg, "serrations")
      } else if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown clinchstud token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate clinchstud property "${property}"`)
    }
    props[property] = parsed
  }
  return clinchStudModelDefinitionSchema.parse(props)
}
