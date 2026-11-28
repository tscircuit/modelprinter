import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { squareHeadBoltModelDefinitionSchema } from "./schema"

const lengths = {
  l: "length",
  length: "length",
  threadl: "threadLength",
  headw: "headWidth",
  af: "headWidth",
  headh: "headHeight",
  chamfer: "chamfer",
} as const

export function parseSquareHeadBoltModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "squareheadbolt" ||
    tokens[0]?.toLowerCase() !== "squareheadbolt"
  ) {
    throw new Error("Expected squareheadbolt without an inline value")
  }
  const props: Record<string, unknown> = { fn: "squareheadbolt" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for squareheadbolt`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "custom") {
      property = "custom"
      parsed = true
    } else if (lower === "squarehead") {
      property = "squareHead"
      parsed = true
    } else if (lower === "squaredrive") {
      property = "squareDrive"
      parsed = true
    } else if (/^m(?:\d+(?:\.\d+)?)$/i.test(lower)) {
      property = "thread"
      parsed = lower
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (!(tokenName in lengths)) {
        throw new Error(`Unknown squareheadbolt token "${token}"`)
      }
      if (!tokenArg) {
        throw new Error(`Missing length value in token "${token}"`)
      }
      property = lengths[tokenName as keyof typeof lengths]
      parsed = tokenArg
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate squareheadbolt property "${property}"`)
    }
    props[property] = parsed
  }
  return squareHeadBoltModelDefinitionSchema.parse(props)
}
