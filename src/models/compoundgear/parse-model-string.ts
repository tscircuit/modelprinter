import {
  parseGearAngle,
  parseGearInteger,
  parseGearToken,
} from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { compoundGearModelDefinitionSchema } from "./schema"

const lengths = {
  module: "module",
  m: "module",
  w: "width",
  width: "width",
  bore: "boreDiameter",
  keyw: "keyWidth",
} as const

export function parseCompoundGearModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "compoundgear" ||
    tokens[0]?.toLowerCase() !== "compoundgear"
  ) {
    throw new Error("Expected compoundgear without an inline value")
  }
  const props: Record<string, unknown> = { fn: "compoundgear" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for compoundgear`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "keyway") {
      property = "keyway"
      parsed = true
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName === "teetha") {
        property = "teethA"
        parsed = parseGearInteger(tokenArg, "teetha")
      } else if (tokenName === "teethb") {
        property = "teethB"
        parsed = parseGearInteger(tokenArg, "teethb")
      } else if (tokenName === "pa") {
        property = "pressureAngleDeg"
        parsed = parseGearAngle(tokenArg, "pa")
      } else if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown compoundgear token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate compoundgear property "${property}"`)
    }
    props[property] = parsed
  }
  return compoundGearModelDefinitionSchema.parse(props)
}
