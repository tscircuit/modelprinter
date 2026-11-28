import {
  parseGearAngle,
  parseGearInteger,
  parseGearToken,
} from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { doubleBallBearingModelDefinitionSchema } from "./schema"

const lengths = {
  id: "innerDiameter",
  bore: "innerDiameter",
  od: "outerDiameter",
  w: "width",
  width: "width",
} as const

export function parseDoubleBallBearingModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "doubleballbearing" ||
    tokens[0]?.toLowerCase() !== "doubleballbearing"
  ) {
    throw new Error("Expected doubleballbearing without an inline value")
  }
  const props: Record<string, unknown> = { fn: "doubleballbearing" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for doubleballbearing`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "open") {
      property = "open"
      parsed = true
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName === "rows") {
        property = "rows"
        parsed = parseGearInteger(tokenArg, "rows")
      } else if (tokenName === "contactangle") {
        property = "contactAngle"
        parsed = parseGearAngle(tokenArg, "contactangle")
      } else if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown doubleballbearing token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate doubleballbearing property "${property}"`)
    }
    props[property] = parsed
  }
  return doubleBallBearingModelDefinitionSchema.parse(props)
}
