import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { dShaftModelDefinitionSchema } from "./schema"

const lengths = {
  d: "diameter",
  od: "diameter",
  l: "length",
  length: "length",
  flatdistance: "flatDistance",
  flatlength: "flatLength",
  endchamfer: "endChamfer",
} as const

export function parseDShaftModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "dshaft" || tokens[0]?.toLowerCase() !== "dshaft") {
    throw new Error("Expected dshaft without an inline value")
  }
  const props: Record<string, unknown> = { fn: "dshaft" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for dshaft`,
      )
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (!(tokenName in lengths)) {
      throw new Error(`Unknown dshaft token "${token}"`)
    }
    if (!tokenArg) {
      throw new Error(`Missing length value in token "${token}"`)
    }
    const property = lengths[tokenName as keyof typeof lengths]
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate dshaft property "${property}"`)
    }
    props[property] = tokenArg
  }
  return dShaftModelDefinitionSchema.parse(props)
}
