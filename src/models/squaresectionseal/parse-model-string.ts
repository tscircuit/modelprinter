import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { squareSectionSealModelDefinitionSchema } from "./schema"

const lengths = {
  id: "innerDiameter",
  section: "sectionWidth",
  cornerr: "cornerRadius",
} as const

export function parseSquareSectionSealModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "squaresectionseal" ||
    tokens[0]?.toLowerCase() !== "squaresectionseal"
  ) {
    throw new Error("Expected squaresectionseal without an inline value")
  }
  const props: Record<string, unknown> = { fn: "squaresectionseal" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for squaresectionseal`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "squareprofile") {
      property = "squareProfile"
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
        throw new Error(`Unknown squaresectionseal token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate squaresectionseal property "${property}"`)
    }
    props[property] = parsed
  }
  return squareSectionSealModelDefinitionSchema.parse(props)
}
