import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { tSlotFloorBracketModelDefinitionSchema } from "./schema"

const lengths = {
  w: "width",
  d: "depth",
  h: "height",
  t: "thickness",
  ribt: "ribThickness",
  hole: "holeDiameter",
  holed: "holeDiameter",
  basehp: "baseHolePitch",
  wallhp: "wallHolePitch",
} as const

export function parseTSlotFloorBracketModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "tslotfloorbracket" ||
    tokens[0]?.toLowerCase() !== "tslotfloorbracket"
  ) {
    throw new Error("Expected tslotfloorbracket without an inline value")
  }
  const props: Record<string, unknown> = { fn: "tslotfloorbracket" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for tslotfloorbracket`,
      )
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName === "ribs") {
      if (!tokenArg) throw new Error(`Missing rib count in "${token}"`)
      if (Object.hasOwn(props, "ribs")) {
        throw new Error("Duplicate tslotfloorbracket ribs")
      }
      props.ribs = parseGearInteger(tokenArg, "ribs")
    } else if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate tslotfloorbracket property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown tslotfloorbracket token "${token}"`)
    }
  }
  return tSlotFloorBracketModelDefinitionSchema.parse(props)
}
