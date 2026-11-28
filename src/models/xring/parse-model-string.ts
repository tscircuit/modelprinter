import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { xRingModelDefinitionSchema } from "./schema"

const lengths = {
  id: "innerDiameter",
  csd: "crossSectionDiameter",
  lober: "lobeRadius",
} as const

export function parseXRingModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "xring" || tokens[0]?.toLowerCase() !== "xring") {
    throw new Error("Expected xring without an inline value")
  }
  const props: Record<string, unknown> = { fn: "xring" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for xring`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "quadrilobe") {
      property = "quadrilobe"
      parsed = true
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName === "lobes") {
        property = "lobes"
        parsed = parseGearInteger(tokenArg, "lobes")
      } else if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown xring token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate xring property "${property}"`)
    }
    props[property] = parsed
  }
  return xRingModelDefinitionSchema.parse(props)
}
