import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { splitShaftCollarModelDefinitionSchema } from "./schema"

const lengths = {
  bore: "boreDiameter",
  od: "outerDiameter",
  w: "width",
  width: "width",
} as const

export function parseSplitShaftCollarModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "splitshaftcollar" ||
    tokens[0]?.toLowerCase() !== "splitshaftcollar"
  ) {
    throw new Error("Expected splitshaftcollar without an inline value")
  }
  const props: Record<string, unknown> = { fn: "splitshaftcollar" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for splitshaftcollar`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "twopiececlamp") {
      property = "twoPieceClamp"
      parsed = true
    } else if (/^m(?:\d+(?:\.\d+)?)$/i.test(lower)) {
      property = "thread"
      parsed = lower
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName === "bolts") {
        property = "bolts"
        parsed = parseGearInteger(tokenArg, "bolts")
      } else if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown splitshaftcollar token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate splitshaftcollar property "${property}"`)
    }
    props[property] = parsed
  }
  return splitShaftCollarModelDefinitionSchema.parse(props)
}
