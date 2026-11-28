import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { steppedShaftModelDefinitionSchema } from "./schema"

const lengths = {
  d: "diameter",
  od: "diameter",
  endd: "endDiameter",
  l: "length",
  length: "length",
  endl: "endLength",
  shoulderfillet: "shoulderFillet",
  endchamfer: "endChamfer",
} as const

export function parseSteppedShaftModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "steppedshaft" ||
    tokens[0]?.toLowerCase() !== "steppedshaft"
  ) {
    throw new Error("Expected steppedshaft without an inline value")
  }
  const props: Record<string, unknown> = { fn: "steppedshaft" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for steppedshaft`,
      )
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (!(tokenName in lengths)) {
      throw new Error(`Unknown steppedshaft token "${token}"`)
    }
    if (!tokenArg) {
      throw new Error(`Missing length value in token "${token}"`)
    }
    const property = lengths[tokenName as keyof typeof lengths]
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate steppedshaft property "${property}"`)
    }
    props[property] = tokenArg
  }
  return steppedShaftModelDefinitionSchema.parse(props)
}
