import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { leafSpringModelDefinitionSchema } from "./schema"

const lengths = {
  w: "width",
  width: "width",
  arcl: "arcLength",
  h: "thickness",
  t: "thickness",
  radius: "radius",
  r: "radius",
} as const

export function parseLeafSpringModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "leafspring" || tokens[0]?.toLowerCase() !== "leafspring") {
    throw new Error("Expected leafspring without an inline value")
  }
  const props: Record<string, unknown> = { fn: "leafspring" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for leafspring`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "custom") {
      property = "custom"
      parsed = true
    } else if (lower === "circulararc") {
      property = "circularArc"
      parsed = true
    } else if (lower === "squareends") {
      property = "squareEnds"
      parsed = true
    } else if (lower === "free") {
      property = "freeState"
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
        throw new Error(`Unknown leafspring token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate leafspring property "${property}"`)
    }
    props[property] = parsed
  }
  return leafSpringModelDefinitionSchema.parse(props)
}
