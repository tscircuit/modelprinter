import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { shaftEndSupportModelDefinitionSchema } from "./schema"

const lengths = {
  bore: "boreDiameter",
  w: "width",
  width: "width",
  h: "height",
  height: "height",
  depth: "depth",
  d: "depth",
  holepitch: "holePitch",
  hp: "holePitch",
  holed: "holeDiameter",
  hole: "holeDiameter",
} as const

export function parseShaftEndSupportModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "shaftendsupport" ||
    tokens[0]?.toLowerCase() !== "shaftendsupport"
  ) {
    throw new Error("Expected shaftendsupport without an inline value")
  }
  const props: Record<string, unknown> = { fn: "shaftendsupport" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for shaftendsupport`,
      )
    }
    const lower = token.toLowerCase()
    const clampMatch = lower.match(/^clamp(m\d+(?:\.\d+)?)$/)
    let property: string
    let parsed: unknown
    if (lower === "base2hole") {
      property = "base2Hole"
      parsed = true
    } else if (clampMatch) {
      property = "clampThread"
      parsed = clampMatch[1]
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown shaftendsupport token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate shaftendsupport property "${property}"`)
    }
    props[property] = parsed
  }
  return shaftEndSupportModelDefinitionSchema.parse(props)
}
