import { parseGearAngle, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { plowBoltModelDefinitionSchema } from "./schema"

const lengths = {
  l: "length",
  length: "length",
  threadl: "threadLength",
  headod: "headOuterDiameter",
  neckw: "neckWidth",
  neckl: "neckLength",
} as const

export function parsePlowBoltModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "plowbolt" || tokens[0]?.toLowerCase() !== "plowbolt") {
    throw new Error("Expected plowbolt without an inline value")
  }
  const props: Record<string, unknown> = { fn: "plowbolt" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for plowbolt`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "custom") {
      property = "custom"
      parsed = true
    } else if (lower === "squareneck") {
      property = "squareNeck"
      parsed = true
    } else if (/^m(?:\d+(?:\.\d+)?)$/i.test(lower)) {
      property = "thread"
      parsed = lower
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName === "headangle") {
        property = "headAngleDeg"
        parsed = parseGearAngle(tokenArg, "headangle")
      } else if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown plowbolt token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate plowbolt property "${property}"`)
    }
    props[property] = parsed
  }
  return plowBoltModelDefinitionSchema.parse(props)
}
