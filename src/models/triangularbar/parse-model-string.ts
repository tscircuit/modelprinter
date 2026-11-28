import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { triangularBarModelDefinitionSchema } from "./schema"

const lengths = {
  side: "sideLength",
  l: "length",
  length: "length",
  cornerr: "cornerRadius",
} as const

export function parseTriangularBarModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "triangularbar" ||
    tokens[0]?.toLowerCase() !== "triangularbar"
  ) {
    throw new Error("Expected triangularbar without an inline value")
  }
  const props: Record<string, unknown> = { fn: "triangularbar" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for triangularbar`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "equilateral") {
      property = "equilateral"
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
        throw new Error(`Unknown triangularbar token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate triangularbar property "${property}"`)
    }
    props[property] = parsed
  }
  return triangularBarModelDefinitionSchema.parse(props)
}
