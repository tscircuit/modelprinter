import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { cartridgeBearingModelDefinitionSchema } from "./schema"

const lengths = {
  bore: "boreDiameter",
  od: "outerDiameter",
  l: "length",
  length: "length",
  locatingflangeod: "locatingFlangeOuterDiameter",
  flangeh: "flangeHeight",
} as const

export function parseCartridgeBearingModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "cartridgebearing" ||
    tokens[0]?.toLowerCase() !== "cartridgebearing"
  ) {
    throw new Error("Expected cartridgebearing without an inline value")
  }
  const props: Record<string, unknown> = { fn: "cartridgebearing" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for cartridgebearing`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "cylindricalfit") {
      property = "cylindricalFit"
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
        throw new Error(`Unknown cartridgebearing token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate cartridgebearing property "${property}"`)
    }
    props[property] = parsed
  }
  return cartridgeBearingModelDefinitionSchema.parse(props)
}
