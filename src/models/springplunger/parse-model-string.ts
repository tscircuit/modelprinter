import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { springPlungerModelDefinitionSchema } from "./schema"

const lengths = {
  l: "length",
  length: "length",
  pind: "pinDiameter",
  projection: "projection",
  stroke: "stroke",
  slotw: "slotWidth",
  slotdepth: "slotDepth",
} as const

export function parseSpringPlungerModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "springplunger" ||
    tokens[0]?.toLowerCase() !== "springplunger"
  ) {
    throw new Error("Expected springplunger without an inline value")
  }
  const props: Record<string, unknown> = { fn: "springplunger" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for springplunger`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "custom") {
      property = "custom"
      parsed = true
    } else if (lower === "roundtip") {
      property = "roundTip"
      parsed = true
    } else if (lower === "slottedrear") {
      property = "slottedRear"
      parsed = true
    } else if (lower === "extended") {
      property = "extended"
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
        throw new Error(`Unknown springplunger token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate springplunger property "${property}"`)
    }
    props[property] = parsed
  }
  return springPlungerModelDefinitionSchema.parse(props)
}
