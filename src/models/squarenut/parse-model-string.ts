import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { squareNutModelDefinitionSchema } from "./schema"

const lengths = {
  w: "width",
  width: "width",
  af: "width",
  h: "height",
  height: "height",
  chamfer: "chamfer",
} as const

export function parseSquareNutModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "squarenut" || tokens[0]?.toLowerCase() !== "squarenut") {
    throw new Error("Expected squarenut without an inline value")
  }
  const props: Record<string, unknown> = { fn: "squarenut" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for squarenut`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "custom") {
      property = "custom"
      parsed = true
    } else if (lower === "squarebody") {
      property = "squareBody"
      parsed = true
    } else if (lower === "throughbore") {
      property = "throughBore"
      parsed = true
    } else if (/^m(?:\d+(?:\.\d+)?)$/i.test(lower)) {
      property = "thread"
      parsed = lower
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown squarenut token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate squarenut property "${property}"`)
    }
    props[property] = parsed
  }
  return squareNutModelDefinitionSchema.parse(props)
}
