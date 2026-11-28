import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { roundNutModelDefinitionSchema } from "./schema"

const lengths = {
  od: "outerDiameter",
  h: "height",
  height: "height",
  slotw: "slotWidth",
  slotdepth: "slotDepth",
} as const

export function parseRoundNutModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "roundnut" || tokens[0]?.toLowerCase() !== "roundnut") {
    throw new Error("Expected roundnut without an inline value")
  }
  const props: Record<string, unknown> = { fn: "roundnut" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for roundnut`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "custom") {
      property = "custom"
      parsed = true
    } else if (lower === "axialslots") {
      property = "axialSlots"
      parsed = true
    } else if (lower === "throughbore") {
      property = "throughBore"
      parsed = true
    } else if (/^m(?:\d+(?:\.\d+)?)$/i.test(lower)) {
      property = "thread"
      parsed = lower
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName === "slots") {
        property = "slots"
        parsed = parseGearInteger(tokenArg, "slots")
      } else if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown roundnut token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate roundnut property "${property}"`)
    }
    props[property] = parsed
  }
  return roundNutModelDefinitionSchema.parse(props)
}
