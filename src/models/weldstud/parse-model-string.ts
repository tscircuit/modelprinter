import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { weldStudModelDefinitionSchema } from "./schema"

const lengths = {
  l: "length",
  length: "length",
  baseod: "baseOuterDiameter",
  baseh: "baseHeight",
  weldtipd: "weldTipDiameter",
  weldtipl: "weldTipLength",
} as const

export function parseWeldStudModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "weldstud" || tokens[0]?.toLowerCase() !== "weldstud") {
    throw new Error("Expected weldstud without an inline value")
  }
  const props: Record<string, unknown> = { fn: "weldstud" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for weldstud`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "custom") {
      property = "custom"
      parsed = true
    } else if (lower === "fullthread") {
      property = "fullThread"
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
        throw new Error(`Unknown weldstud token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate weldstud property "${property}"`)
    }
    props[property] = parsed
  }
  return weldStudModelDefinitionSchema.parse(props)
}
