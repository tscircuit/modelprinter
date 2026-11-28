import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { dinRailModelDefinitionSchema } from "./schema"

const lengths = {
  w: "width",
  width: "width",
  h: "height",
  height: "height",
  l: "length",
  length: "length",
  t: "sheetThickness",
  thickness: "sheetThickness",
  basew: "baseWidth",
  basewidth: "baseWidth",
  lip: "lipWidth",
  lipw: "lipWidth",
} as const

export function parseDinRailModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "dinrail" || tokens[0]?.toLowerCase() !== "dinrail") {
    throw new Error("Expected dinrail without an inline value")
  }
  const props: Record<string, unknown> = { fn: "dinrail" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for dinrail`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "en60715th35x7.5" || lower === "th35x7.5") {
      property = "en60715Th35x75"
      parsed = true
    } else if (lower === "tophat") {
      property = "topHat"
      parsed = true
    } else if (lower === "unslotted") {
      property = "unslotted"
      parsed = true
    } else if (lower === "slotted") {
      property = "unslotted"
      parsed = false
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown dinrail token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate dinrail property "${property}"`)
    }
    props[property] = parsed
  }
  return dinRailModelDefinitionSchema.parse(props)
}
