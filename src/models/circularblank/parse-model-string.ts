import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { circularBlankModelDefinitionSchema } from "./schema"

const lengths = {
  d: "diameter",
  od: "diameter",
  t: "thickness",
  rimr: "rimRadius",
} as const

export function parseCircularBlankModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "circularblank" ||
    tokens[0]?.toLowerCase() !== "circularblank"
  ) {
    throw new Error("Expected circularblank without an inline value")
  }
  const props: Record<string, unknown> = { fn: "circularblank" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for circularblank`,
      )
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate circularblank property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown circularblank token "${token}"`)
    }
  }
  return circularBlankModelDefinitionSchema.parse(props)
}
