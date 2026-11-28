import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { springDetentModelDefinitionSchema } from "./schema"

const lengths = {
  l: "length",
  length: "length",
  balld: "ballDiameter",
  projection: "projection",
  slotw: "slotWidth",
  slotdepth: "slotDepth",
} as const

export function parseSpringDetentModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "springdetent" ||
    tokens[0]?.toLowerCase() !== "springdetent"
  ) {
    throw new Error("Expected springdetent without an inline value")
  }
  const props: Record<string, unknown> = { fn: "springdetent" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for springdetent`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "custom") {
      property = "custom"
      parsed = true
    } else if (lower === "flatfront") {
      property = "flatFront"
      parsed = true
    } else if (lower === "slottedrear") {
      property = "slottedRear"
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
        throw new Error(`Unknown springdetent token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate springdetent property "${property}"`)
    }
    props[property] = parsed
  }
  return springDetentModelDefinitionSchema.parse(props)
}
