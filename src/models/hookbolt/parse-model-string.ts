import { parseGearAngle, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { hookBoltModelDefinitionSchema } from "./schema"

const lengths = {
  straightl: "straightLength",
  threadl: "threadLength",
  hookid: "hookInnerDiameter",
  hookwire: "hookWireDiameter",
} as const

export function parseHookBoltModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "hookbolt" || tokens[0]?.toLowerCase() !== "hookbolt") {
    throw new Error("Expected hookbolt without an inline value")
  }
  const props: Record<string, unknown> = { fn: "hookbolt" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for hookbolt`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "custom") {
      property = "custom"
      parsed = true
    } else if (lower === "flattip") {
      property = "flatTip"
      parsed = true
    } else if (/^m(?:\d+(?:\.\d+)?)$/i.test(lower)) {
      property = "thread"
      parsed = lower
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName === "hookangle") {
        property = "hookAngleDeg"
        parsed = parseGearAngle(tokenArg, "hookangle")
      } else if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown hookbolt token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate hookbolt property "${property}"`)
    }
    props[property] = parsed
  }
  return hookBoltModelDefinitionSchema.parse(props)
}
