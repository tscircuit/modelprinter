import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { flangedBallBearingModelDefinitionSchema } from "./schema"

const lengths = {
  id: "innerDiameter",
  od: "outerDiameter",
  w: "width",
  flangeod: "flangeOuterDiameter",
  flangethickness: "flangeThickness",
} as const

export function parseFlangedBallBearingModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "flangedballbearing" ||
    tokens[0]?.toLowerCase() !== "flangedballbearing"
  ) {
    throw new Error("Expected flangedballbearing without an inline value")
  }
  const props: Record<string, unknown> = { fn: "flangedballbearing" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for flangedballbearing`,
      )
    }
    const lower = token.toLowerCase()
    if (lower === "open" || lower === "shielded" || lower === "sealed") {
      if (Object.hasOwn(props, "closure")) {
        throw new Error("Duplicate flangedballbearing closure flag")
      }
      props.closure = lower
      continue
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName === "rows") {
      if (!tokenArg) throw new Error(`Missing row count in "${token}"`)
      if (Object.hasOwn(props, "rows")) {
        throw new Error("Duplicate flangedballbearing rows")
      }
      props.rows = parseGearInteger(tokenArg, "rows")
    } else if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate flangedballbearing property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown flangedballbearing token "${token}"`)
    }
  }
  return flangedBallBearingModelDefinitionSchema.parse(props)
}
