import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { wingScrewModelDefinitionSchema } from "./schema"

const lengths = {
  l: "length",
  length: "length",
  wingw: "wingSpan",
  wingh: "wingHeight",
  wingth: "wingThickness",
  bossod: "bossOuterDiameter",
} as const

export function parseWingScrewModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "wingscrew" || tokens[0]?.toLowerCase() !== "wingscrew") {
    throw new Error("Expected wingscrew without an inline value")
  }
  const props: Record<string, unknown> = { fn: "wingscrew" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for wingscrew`,
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
    } else if (lower === "twinwing") {
      property = "twinWing"
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
        throw new Error(`Unknown wingscrew token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate wingscrew property "${property}"`)
    }
    props[property] = parsed
  }
  return wingScrewModelDefinitionSchema.parse(props)
}
