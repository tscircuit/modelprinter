import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { ballStudModelDefinitionSchema } from "./schema"

const lengths = {
  l: "threadLength",
  threadl: "threadLength",
  balld: "ballDiameter",
  neckd: "neckDiameter",
  neckl: "neckLength",
  shoulderaf: "shoulderAcrossFlats",
  shoulderh: "shoulderHeight",
} as const

export function parseBallStudModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "ballstud" || tokens[0]?.toLowerCase() !== "ballstud") {
    throw new Error("Expected ballstud without an inline value")
  }
  const props: Record<string, unknown> = { fn: "ballstud" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for ballstud`,
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
        throw new Error(`Unknown ballstud token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate ballstud property "${property}"`)
    }
    props[property] = parsed
  }
  return ballStudModelDefinitionSchema.parse(props)
}
