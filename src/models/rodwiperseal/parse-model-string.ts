import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { rodWiperSealModelDefinitionSchema } from "./schema"

const lengths = {
  rodod: "rodOuterDiameter",
  od: "outerDiameter",
  h: "height",
  height: "height",
  bodyid: "bodyInnerDiameter",
  lipt: "lipThickness",
  baset: "baseThickness",
} as const

export function parseRodWiperSealModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "rodwiperseal" ||
    tokens[0]?.toLowerCase() !== "rodwiperseal"
  ) {
    throw new Error("Expected rodwiperseal without an inline value")
  }
  const props: Record<string, unknown> = { fn: "rodwiperseal" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for rodwiperseal`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "singlelip") {
      property = "singleLip"
      parsed = true
    } else if (lower === "inwardlip") {
      property = "inwardLip"
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
        throw new Error(`Unknown rodwiperseal token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate rodwiperseal property "${property}"`)
    }
    props[property] = parsed
  }
  return rodWiperSealModelDefinitionSchema.parse(props)
}
