import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { dinBoxModelDefinitionSchema } from "./schema"

const lengths = {
  w: "width",
  width: "width",
  d: "depth",
  depth: "depth",
  h: "height",
  height: "height",
  wall: "wallThickness",
} as const

export function parseDinBoxModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "dinbox" || tokens[0]?.toLowerCase() !== "dinbox") {
    throw new Error("Expected dinbox without an inline value")
  }
  const props: Record<string, unknown> = { fn: "dinbox" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for dinbox`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "th35x7.5" || lower === "th35x75") {
      property = "th35x75"
      parsed = true
    } else if (lower === "rearlowerclip") {
      property = "rearLowerClip"
      parsed = true
    } else if (lower === "topbottomterminals") {
      property = "topBottomTerminals"
      parsed = true
    } else if (lower === "screwonlid") {
      property = "screwOnLid"
      parsed = true
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown dinbox token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate dinbox property "${property}"`)
    }
    props[property] = parsed
  }
  return dinBoxModelDefinitionSchema.parse(props)
}
