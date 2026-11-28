import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { shoulderWasherModelDefinitionSchema } from "./schema"

const lengths = {
  id: "innerDiameter",
  od: "outerDiameter",
  flangeh: "flangeHeight",
  bossod: "bossOuterDiameter",
  bossl: "bossLength",
} as const

export function parseShoulderWasherModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "shoulderwasher" ||
    tokens[0]?.toLowerCase() !== "shoulderwasher"
  ) {
    throw new Error("Expected shoulderwasher without an inline value")
  }
  const props: Record<string, unknown> = { fn: "shoulderwasher" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for shoulderwasher`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "custom") {
      property = "custom"
      parsed = true
    } else if (lower === "round") {
      property = "round"
      parsed = true
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (!(tokenName in lengths)) {
        throw new Error(`Unknown shoulderwasher token "${token}"`)
      }
      if (!tokenArg) {
        throw new Error(`Missing length value in token "${token}"`)
      }
      property = lengths[tokenName as keyof typeof lengths]
      parsed = tokenArg
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate shoulderwasher property "${property}"`)
    }
    props[property] = parsed
  }
  return shoulderWasherModelDefinitionSchema.parse(props)
}
