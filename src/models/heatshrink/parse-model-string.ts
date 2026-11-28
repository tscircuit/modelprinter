import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { heatShrinkModelDefinitionSchema } from "./schema"

const lengths = {
  id: "innerDiameter",
  od: "outerDiameter",
  l: "length",
  length: "length",
} as const

export function parseHeatShrinkModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "heatshrink" || tokens[0]?.toLowerCase() !== "heatshrink") {
    throw new Error("Expected heatshrink without an inline value")
  }
  const props: Record<string, unknown> = { fn: "heatshrink" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for heatshrink`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "squareends") {
      property = "squareEnds"
      parsed = true
    } else if (lower === "unshrunk") {
      property = "unshrunk"
      parsed = true
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown heatshrink token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate heatshrink property "${property}"`)
    }
    props[property] = parsed
  }
  return heatShrinkModelDefinitionSchema.parse(props)
}
