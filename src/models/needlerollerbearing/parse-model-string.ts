import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { needleRollerBearingModelDefinitionSchema } from "./schema"

const lengths = {
  id: "innerDiameter",
  od: "outerDiameter",
  w: "width",
} as const

export function parseNeedleRollerBearingModelString(
  raw: RawModelprinterParams,
) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "needlerollerbearing" ||
    tokens[0]?.toLowerCase() !== "needlerollerbearing"
  ) {
    throw new Error("Expected needlerollerbearing without an inline value")
  }
  const props: Record<string, unknown> = { fn: "needlerollerbearing" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for needlerollerbearing`,
      )
    }
    const lower = token.toLowerCase()
    if (lower === "open" || lower === "sealed") {
      if (Object.hasOwn(props, "closure")) {
        throw new Error("Duplicate needlerollerbearing closure flag")
      }
      props.closure = lower
      continue
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName === "rows") {
      if (!tokenArg) throw new Error(`Missing row count in "${token}"`)
      if (Object.hasOwn(props, "rows")) {
        throw new Error("Duplicate needlerollerbearing rows")
      }
      props.rows = parseGearInteger(tokenArg, "rows")
    } else if (tokenName === "innerring") {
      if (!tokenArg)
        throw new Error(`Missing innerring flag value in "${token}"`)
      if (Object.hasOwn(props, "innerRing")) {
        throw new Error("Duplicate needlerollerbearing innerring")
      }
      props.innerRing = parseGearInteger(tokenArg, "innerring")
    } else if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate needlerollerbearing property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown needlerollerbearing token "${token}"`)
    }
  }
  return needleRollerBearingModelDefinitionSchema.parse(props)
}
