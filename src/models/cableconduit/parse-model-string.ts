import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { cableConduitModelDefinitionSchema } from "./schema"

const lengths = {
  od: "outerDiameter",
  id: "innerDiameter",
  l: "length",
  length: "length",
  p: "pitch",
  pitch: "pitch",
  ribdepth: "ribDepth",
} as const

export function parseCableConduitModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "cableconduit" ||
    tokens[0]?.toLowerCase() !== "cableconduit"
  ) {
    throw new Error("Expected cableconduit without an inline value")
  }
  const props: Record<string, unknown> = { fn: "cableconduit" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for cableconduit`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "roundcorrugated") {
      property = "roundCorrugated"
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
        throw new Error(`Unknown cableconduit token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate cableconduit property "${property}"`)
    }
    props[property] = parsed
  }
  return cableConduitModelDefinitionSchema.parse(props)
}
