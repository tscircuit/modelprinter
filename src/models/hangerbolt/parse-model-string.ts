import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { hangerBoltModelDefinitionSchema } from "./schema"

const lengths = {
  l: "length",
  length: "length",
  machinethreadl: "machineThreadLength",
  woodd: "woodDiameter",
  woodthreadpitch: "woodThreadPitch",
  woodthreadl: "woodThreadLength",
  af: "acrossFlats",
  flatl: "flatLength",
} as const

export function parseHangerBoltModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "hangerbolt" || tokens[0]?.toLowerCase() !== "hangerbolt") {
    throw new Error("Expected hangerbolt without an inline value")
  }
  const props: Record<string, unknown> = { fn: "hangerbolt" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for hangerbolt`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "custom") {
      property = "custom"
      parsed = true
    } else if (lower === "centerflats") {
      property = "centerFlats"
      parsed = true
    } else if (lower === "conetip") {
      property = "coneTip"
      parsed = true
    } else if (/^m(?:\d+(?:\.\d+)?)$/i.test(lower)) {
      property = "thread"
      parsed = lower
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName === "flats") {
        property = "flats"
        parsed = parseGearInteger(tokenArg, "flats")
      } else if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown hangerbolt token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate hangerbolt property "${property}"`)
    }
    props[property] = parsed
  }
  return hangerBoltModelDefinitionSchema.parse(props)
}
