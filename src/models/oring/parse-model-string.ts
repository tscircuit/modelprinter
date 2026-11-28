import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { oRingModelDefinitionSchema } from "./schema"

const lengths = {
  id: "innerDiameter",
  innerdiameter: "innerDiameter",
  csd: "crossSectionDiameter",
  w: "crossSectionDiameter",
} as const

export function parseORingModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "oring" || tokens[0]?.toLowerCase() !== "oring") {
    throw new Error("Expected oring without an inline argument")
  }
  const props: Record<string, unknown> = { fn: "oring" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for oring`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "as568") {
      property = "as568"
      parsed = true
    } else if (lower === "round") {
      property = "round"
      parsed = true
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName === "size") {
        if (!/^\d{1,3}$/.test(tokenArg)) {
          throw new Error(`Invalid AS568 dash size in token "${token}"`)
        }
        property = "size"
        parsed = tokenArg.padStart(3, "0")
      } else if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length argument in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown oring token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate oring property "${property}"`)
    }
    props[property] = parsed
  }
  return oRingModelDefinitionSchema.parse(props)
}
