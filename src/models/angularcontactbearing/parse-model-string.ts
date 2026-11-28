import {
  parseGearAngle,
  parseGearInteger,
  parseGearToken,
} from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { angularContactBearingModelDefinitionSchema } from "./schema"

const lengths = {
  id: "innerDiameter",
  bore: "innerDiameter",
  od: "outerDiameter",
  w: "width",
  width: "width",
} as const

export function parseAngularContactBearingModelString(
  raw: RawModelprinterParams,
) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "angularcontactbearing" ||
    tokens[0]?.toLowerCase() !== "angularcontactbearing"
  ) {
    throw new Error("Expected angularcontactbearing without an inline value")
  }
  const props: Record<string, unknown> = { fn: "angularcontactbearing" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for angularcontactbearing`,
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
        throw new Error(`Unknown angularcontactbearing token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate angularcontactbearing property "${property}"`)
    }
    props[property] = parsed
  }
  return angularContactBearingModelDefinitionSchema.parse(props)
}
