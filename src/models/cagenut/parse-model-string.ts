import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { parseCageNutMetricThread } from "./normalize"
import { cageNutModelDefinitionSchema } from "./schema"

const lengths = {
  nutw: "nutWidth",
  nuth: "nutHeight",
  cagew: "cageWidth",
  cageh: "cageHeight",
  wall: "wallThickness",
  earspan: "earSpan",
} as const

export function parseCageNutModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "cagenut" || tokens[0]?.toLowerCase() !== "cagenut") {
    throw new Error("Expected cagenut without an inline value")
  }
  const props: Record<string, unknown> = { fn: "cagenut" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for cagenut`,
      )
    }
    const lower = token.toLowerCase()
    if (lower === "opposedears") {
      if (Object.hasOwn(props, "opposedEars")) {
        throw new Error("Duplicate cagenut opposedears flag")
      }
      props.opposedEars = true
      continue
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName === "m") {
      if (!tokenArg) throw new Error(`Missing metric size in "${token}"`)
      if (Object.hasOwn(props, "threadDiameter")) {
        throw new Error("Duplicate cagenut thread size")
      }
      props.threadDiameter = parseCageNutMetricThread(tokenArg)
    } else if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate cagenut property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown cagenut token "${token}"`)
    }
  }
  return cageNutModelDefinitionSchema.parse(props)
}
