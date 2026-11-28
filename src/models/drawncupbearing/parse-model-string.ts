import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { drawnCupBearingModelDefinitionSchema } from "./schema"

const lengths = {
  id: "innerDiameter",
  od: "outerDiameter",
  w: "width",
} as const

export function parseDrawnCupBearingModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "drawncupbearing" ||
    tokens[0]?.toLowerCase() !== "drawncupbearing"
  ) {
    throw new Error("Expected drawncupbearing without an inline value")
  }
  const props: Record<string, unknown> = { fn: "drawncupbearing" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for drawncupbearing`,
      )
    }
    const lower = token.toLowerCase()
    if (lower === "openended" || lower === "closedend") {
      if (Object.hasOwn(props, "cupStyle")) {
        throw new Error("Duplicate drawncupbearing cup style flag")
      }
      props.cupStyle = lower
      continue
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName === "rows") {
      if (!tokenArg) throw new Error(`Missing row count in "${token}"`)
      if (Object.hasOwn(props, "rows")) {
        throw new Error("Duplicate drawncupbearing rows")
      }
      props.rows = parseGearInteger(tokenArg, "rows")
    } else if (tokenName === "innerring") {
      if (!tokenArg) throw new Error(`Missing innerring flag in "${token}"`)
      if (Object.hasOwn(props, "innerRing")) {
        throw new Error("Duplicate drawncupbearing innerring")
      }
      props.innerRing = parseGearInteger(tokenArg, "innerring")
    } else if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate drawncupbearing property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown drawncupbearing token "${token}"`)
    }
  }
  return drawnCupBearingModelDefinitionSchema.parse(props)
}
