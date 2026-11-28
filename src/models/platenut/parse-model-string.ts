import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { plateNutModelDefinitionSchema } from "./schema"

const lengths = {
  w: "width",
  width: "width",
  l: "length",
  length: "length",
  strip: "stripThickness",
  holep: "holePitch",
  hp: "holePitch",
  rivetholed: "rivetHoleDiameter",
  nutod: "nutOuterDiameter",
  nuth: "nutHeight",
} as const

export function parsePlateNutModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "platenut" || tokens[0]?.toLowerCase() !== "platenut") {
    throw new Error("Expected platenut without an inline value")
  }
  const props: Record<string, unknown> = { fn: "platenut" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for platenut`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "custom") {
      property = "custom"
      parsed = true
    } else if (lower === "flat") {
      property = "flat"
      parsed = true
    } else if (/^m(?:\d+(?:\.\d+)?)$/i.test(lower)) {
      property = "thread"
      parsed = lower
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (!(tokenName in lengths)) {
        throw new Error(`Unknown platenut token "${token}"`)
      }
      if (!tokenArg) {
        throw new Error(`Missing length value in token "${token}"`)
      }
      property = lengths[tokenName as keyof typeof lengths]
      parsed = tokenArg
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate platenut property "${property}"`)
    }
    props[property] = parsed
  }
  return plateNutModelDefinitionSchema.parse(props)
}
