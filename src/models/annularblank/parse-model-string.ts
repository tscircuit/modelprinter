import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { annularBlankModelDefinitionSchema } from "./schema"

const lengths = {
  od: "outerDiameter",
  id: "innerDiameter",
  t: "thickness",
  rimr: "rimRadius",
} as const

export function parseAnnularBlankModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "annularblank" ||
    tokens[0]?.toLowerCase() !== "annularblank"
  ) {
    throw new Error("Expected annularblank without an inline value")
  }
  const props: Record<string, unknown> = { fn: "annularblank" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for annularblank`,
      )
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate annularblank property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown annularblank token "${token}"`)
    }
  }
  return annularBlankModelDefinitionSchema.parse(props)
}
