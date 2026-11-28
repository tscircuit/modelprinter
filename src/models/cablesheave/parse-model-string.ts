import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { cableSheaveModelDefinitionSchema } from "./schema"

const lengths = {
  od: "outerDiameter",
  bore: "boreDiameter",
  w: "width",
  width: "width",
  groover: "grooveRadius",
  groovedepth: "grooveDepth",
} as const

export function parseCableSheaveModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "cablesheave" || tokens[0]?.toLowerCase() !== "cablesheave") {
    throw new Error("Expected cablesheave without an inline value")
  }
  const props: Record<string, unknown> = { fn: "cablesheave" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for cablesheave`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "ugroove") {
      property = "uGroove"
      parsed = true
    } else if (lower === "bearingbore") {
      property = "bearingBore"
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
        throw new Error(`Unknown cablesheave token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate cablesheave property "${property}"`)
    }
    props[property] = parsed
  }
  return cableSheaveModelDefinitionSchema.parse(props)
}
