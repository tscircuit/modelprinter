import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { squareWasherModelDefinitionSchema } from "./schema"

const lengths = {
  id: "innerDiameter",
  w: "width",
  width: "width",
  l: "length",
  length: "length",
  h: "height",
  height: "height",
  t: "height",
} as const

export function parseSquareWasherModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "squarewasher" ||
    tokens[0]?.toLowerCase() !== "squarewasher"
  ) {
    throw new Error("Expected squarewasher without an inline value")
  }
  const props: Record<string, unknown> = { fn: "squarewasher" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for squarewasher`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "custom") {
      property = "custom"
      parsed = true
    } else if (lower === "centeredhole") {
      property = "centeredHole"
      parsed = true
    } else if (lower === "squarecorners") {
      property = "squareCorners"
      parsed = true
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (!(tokenName in lengths)) {
        throw new Error(`Unknown squarewasher token "${token}"`)
      }
      if (!tokenArg) {
        throw new Error(`Missing length value in token "${token}"`)
      }
      property = lengths[tokenName as keyof typeof lengths]
      parsed = tokenArg
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate squarewasher property "${property}"`)
    }
    props[property] = parsed
  }
  return squareWasherModelDefinitionSchema.parse(props)
}
