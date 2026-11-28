import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { sexBoltModelDefinitionSchema } from "./schema"

const lengths = {
  barrelod: "barrelOuterDiameter",
  barrell: "barrelLength",
  flangeod: "flangeOuterDiameter",
  flangeh: "flangeHeight",
  screwl: "screwLength",
  slotw: "slotWidth",
  slotdepth: "slotDepth",
} as const

export function parseSexBoltModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "sexbolt" || tokens[0]?.toLowerCase() !== "sexbolt") {
    throw new Error("Expected sexbolt without an inline value")
  }
  const props: Record<string, unknown> = { fn: "sexbolt" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for sexbolt`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "custom") {
      property = "custom"
      parsed = true
    } else if (lower === "slotted") {
      property = "slotted"
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
        throw new Error(`Unknown sexbolt token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate sexbolt property "${property}"`)
    }
    props[property] = parsed
  }
  return sexBoltModelDefinitionSchema.parse(props)
}
